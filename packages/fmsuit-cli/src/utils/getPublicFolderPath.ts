import fs from 'node:fs'

interface getPublicFolderType {
  pathProject: string
}

/**
 * Determines the public folder path by checking common directory names.
 * Checks for 'public', 'src/assets', and 'static' in order.
 * @param {getPublicFolderType} options - Configuration object
 * @param {string} options.pathProject - The root path of the project
 * @returns {string} The path to the public folder, defaults to 'pathProject/public' if none found
 */
export function getPublicFolderPath({
  pathProject,
}: getPublicFolderType): string {
  const possibleFolder = ['public', 'src/assets', 'static']

  for (const folder of possibleFolder) {
    const fullPath = `${pathProject}/${folder}`
    if (fs.existsSync(fullPath)) {
      return fullPath
    }
  }

  return `${pathProject}/public`
}
