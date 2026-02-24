import { unzipSync } from "fflate";
import { unlink } from "node:fs/promises";
import { mkdir } from "node:fs/promises";
import path from "node:path";

interface ExtractZipType {
  zipPath: string
  targetDir: string
}

/**
 * Extracts a zip file to the specified target directory and removes the zip file afterwards.
 * @param {ExtractZipType} options - Configuration object
 * @param {string} options.zipPath - The path to the zip file to extract
 * @param {string} options.targetDir - The destination directory where files will be extracted
 * @returns {Promise<boolean>} Returns true if extraction was successful
 */
export async function extractZip({ zipPath, targetDir }: ExtractZipType): Promise<boolean> {
  const buffer = await Bun.file(zipPath).arrayBuffer();
  const unzipped = unzipSync(new Uint8Array(buffer));

  for (const [relativePath, data] of Object.entries(unzipped)) {
    const fullPath = path.join(targetDir, relativePath);

    if (relativePath.endsWith("/")) {
      await mkdir(fullPath, { recursive: true });
      continue;
    }

    await mkdir(path.dirname(fullPath), { recursive: true });
    await Bun.write(fullPath, data);
  }

  await unlink(zipPath)
  return true
}