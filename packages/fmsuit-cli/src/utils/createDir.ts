import fs from 'node:fs'

interface CreateDirType {
  basePath: string
  name: string
}

/**
 * Creates a directory at the specified path. If the path already exists,
 * automatically appends a suffix or increments a counter to create a unique path.
 * @param {CreateDirType} options - Configuration object
 * @param {string} options.basePath - The base path where the directory should be created
 * @param {string} options.name - The name to append if the base path exists
 * @returns {{ currentPath: string }} Object containing the final created directory path
 */
export function createDir({ basePath, name }: CreateDirType): {
  currentPath: string
} {
  let currentPath = basePath

  if (fs.existsSync(currentPath)) {
    currentPath = `${basePath}-${name}`
  }

  if (fs.existsSync(currentPath)) {
    let counter = 1
    let tempPath = `${currentPath}-${counter}`

    while (fs.existsSync(tempPath)) {
      counter++
      tempPath = `${currentPath}-${counter}`
    }

    currentPath = tempPath
  }

  fs.mkdirSync(currentPath, { recursive: true })
  return { currentPath }
}
