import { getPublicFolderPath } from "@utils/getPublicFolderPath";
import { readdir, cp, stat } from "node:fs/promises"
import fs from "node:fs"
import { join } from "node:path";
import { extractHtmlData } from "./extractHtmlData";
import { frameworkAdapters } from "@/templates/frameworkAdapters";
import { formatCode } from "@utils/formatCode";
import type { TechnologySelector } from "@typings/technologySelector";

interface MergeType {
  originalDir: string
  destinationDir: string
}

/**
 * Copies files with specific extensions (.md, .json, .jpg) from source to destination directory.
 * Removes existing README.md in destination before copying new files.
 * @param {MergeType} options - Configuration object
 * @param {string} options.originalDir - Source directory to copy files from
 * @param {string} options.destinationDir - Target directory to copy files to
 * @returns {Promise<void>}
 */
export async function copyPasteFiles({ destinationDir, originalDir }: MergeType): Promise<void> {
  const files = await readdir(originalDir)
  const validextensions = [".md", ".json", ".jpg"];

  const readmePath = join(destinationDir, "README.md")

  if (fs.existsSync(readmePath)) {
    Bun.file(readmePath).delete()
  }

  const promises = files.map(async (nameFile) => {
    const isValid = validextensions.some(ex => nameFile.endsWith(ex))

    if (isValid) {
      const originalPath = join(originalDir, nameFile)
      const destinationPath = join(destinationDir, nameFile)

      await Bun.write(destinationPath, Bun.file(originalPath))
    }
  })

  await Promise.all(promises)
}

interface CopyPasteFoldersType extends MergeType {
  copyAll?: boolean
}

/**
 * Copies directories from source to destination. By default only copies 'assets' folder to public directory.
 * When copyAll is true, copies all folders to the destination directory while stripping '-main' suffix.
 * @param {CopyPasteFoldersType} options - Configuration object
 * @param {string} options.originalDir - Source directory to copy folders from
 * @param {string} options.destinationDir - Target directory to copy folders to
 * @param {boolean} [options.copyAll=false] - If false, only copies 'assets' folder; if true, copies all folders
 * @returns {Promise<void>}
 */
export async function copyPasteFolders({ destinationDir, originalDir, copyAll = false }: CopyPasteFoldersType): Promise<void> {
  const publicFolder = getPublicFolderPath({
    pathProject: destinationDir
  })

  const input = await readdir(originalDir)

  const promises = input.map(async (itemName) => {
    const originalPath = join(originalDir, itemName)
    const itemStat = await stat(originalPath)

    if (itemStat.isDirectory()) {
      const isSpecificFolder = itemName === "assets";

      if (!copyAll && !isSpecificFolder) return

      const cleanName = itemName.replace("-main", "");

      const targetBase = (!copyAll && isSpecificFolder) ? publicFolder : destinationDir;
      const destinationPath = join(targetBase, cleanName);

      await cp(originalPath, destinationPath, {
        recursive: true,
        force: true
      });
    }
  })

  await Promise.all(promises)
}

type Framework = {
  framework: TechnologySelector
}

/**
 * Migrates HTML structure to a specific framework by extracting HTML data and applying framework-specific templates.
 * Formats the generated code and writes it to the corresponding files in the destination directory.
 * @param {Framework & MergeType} options - Configuration object
 * @param {string} options.originalDir - Source directory containing index.html
 * @param {string} options.destinationDir - Target directory where framework files will be written
 * @param {TechnologySelector} options.framework - The target framework (e.g., 'react-ts', 'vue-ts')
 * @returns {Promise<void>}
 * @throws {Error} If the framework is not supported or if file operations fail
 */
export async function migrateHtmlToFramework({ destinationDir, originalDir, framework }: Framework & MergeType): Promise<void> {
  const orignalHtml = join(originalDir, "index.html")
  const htmlData = await extractHtmlData({
    path: orignalHtml
  })

  const baseTech = framework.split("-")[0] as keyof typeof frameworkAdapters

  const templateGenerator = frameworkAdapters[baseTech]

  if (!templateGenerator) {
    throw new Error(`The ${framework} framework is not yet supported.`)
  }

  const selectedFramework = templateGenerator(htmlData)

  for (const item of selectedFramework) {
    const fullPath = join(destinationDir, item.file)
    const file = Bun.file(fullPath)

    if (!(await file.exists())) {
      console.error(`File does not exist: ${item.file}`)
      continue
    }

    const formattedCode = await formatCode({
      code: item.code,
      fileName: item.file
    })

    try {
      await Bun.write(fullPath, formattedCode)
    } catch (err) {
      throw new Error(`Error writing to ${item.file}: ${err}`)
    }
  }
}

/**
 * Orchestrates the complete merge process: copies files, copies folders, and migrates HTML to the target framework.
 * Executes all operations in parallel.
 * @param {Framework & MergeType} options - Configuration object
 * @param {string} options.originalDir - Source directory with challenge files
 * @param {string} options.destinationDir - Target directory where merged content will be placed
 * @param {TechnologySelector} options.framework - The target framework for migration
 * @returns {Promise<void>}
 */
export async function mergeChallenge({
  originalDir,
  destinationDir,
  framework
}: Framework & MergeType): Promise<void> {
  const attributes = {
    destinationDir,
    originalDir
  }

  await Promise.all([
    copyPasteFiles(attributes),
    copyPasteFolders(attributes),
    migrateHtmlToFramework({
      ...attributes,
      framework
    })
  ])
}