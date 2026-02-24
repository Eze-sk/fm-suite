import type { TechnologySelector } from "@typings/technologySelector"
import { $ } from "bun"
import { createDir } from "@utils/createDir"
import path from "node:path"

interface InitProjectType {
  dirPath: string
  framework: TechnologySelector
  packageManager?: "npm" | "pnpm" | "Bun"
}

/**
 * Creates a new starter project using the specified framework template.
 * Supports Vite, Next.js, and Astro frameworks with automatic package installation.
 * @param {InitProjectType} options - Configuration object
 * @param {string} options.dirPath - Base directory path where project will be created
 * @param {TechnologySelector} options.framework - The framework to use (e.g., 'vite-react', 'nextjs', 'astro')
 * @param {"npm" | "pnpm" | "Bun"} [options.packageManager] - Package manager to use for installation
 * @returns {Promise<{ currentPath: string }>} Object containing the actual path where project was created
 * @throws {Error} If project creation or installation fails
 */
export async function buildStarter({ dirPath, framework, packageManager }: InitProjectType): Promise<{
  currentPath: string
}> {
  const { currentPath } = createDir({
    basePath: dirPath,
    name: framework
  })

  const parentDir = path.dirname(currentPath);
  const projectName = path.basename(currentPath);

  const getArgs = (): string[] => {
    if (framework.includes("vite")) {
      const template = framework.replace("vite-", "");
      return ["vite@latest", projectName, "--template", "--no-interactive", template];
    }

    if (framework === "nextjs") {
      return ["next-app@latest", currentPath, "--yes"];
    }

    if (framework === "astro") {
      return ["astro@latest", currentPath, "--template", "minimal", "--install", "--no-git"];
    }

    return ["next-app@latest", currentPath, "--yes"]
  };

  const installPackages = async (): Promise<void> => {
    if (packageManager === "Bun") {
      await $`bun install --cwd ${currentPath}`.quiet()
    } else {
      await $`${packageManager} --prefix ${currentPath} install`.quiet()
    }
  }

  const args = getArgs();

  try {
    if (framework.includes("vite")) {
      await $`${packageManager} create ${args}`.cwd(parentDir).quiet();
    } else {
      await $`${packageManager} create ${args}`.quiet();
    }

    await installPackages()
    return { currentPath }
  } catch (err) {
    throw new Error(`${err}`)
  }
}