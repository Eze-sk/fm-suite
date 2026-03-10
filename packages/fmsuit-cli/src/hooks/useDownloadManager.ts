import { join } from "node:path";
import { useAppStore } from "@/stores/useApp"
import { buildStarter } from "@lib/buildStarter"
import type { DlChallengeReturn } from "@lib/downloadChallenge"
import { copyPasteFolders, mergeChallenge } from "@lib/mergeChallenge"
import type { PackageManagerType, TechnologySelector } from "@typings/technologySelector"
import { useEffect, useRef, useState } from "react"
import type { ChallengeScrap } from "@typings/challengeData";

/**
 * Interface for the props of the useDownloadChallenge hook.
 * @interface UseDlChallengeType
 * @property {string} [downloadLink] - The download link for the challenge.
 * @property {TechnologySelector} [technologie] - The selected technology for the challenge.
 * @property {ChallengeScrap | undefined} [challengeData] - The challenge data.
 * @property {PackageManagerType} [packageManager] - The selected package manager.
 */
interface UseDlChallengeType {
  downloadLink?: string
  technologie?: TechnologySelector
  challengeData?: ChallengeScrap | undefined
  packageManager?: PackageManagerType
}

/**
 * Custom hook for managing challenge downloads and related processes.
 * @param {UseDlChallengeType} { downloadLink, technologie, challengeData, packageManager } - The props for the hook.
 * @returns {{ startDownload: () => void }} An object containing the startDownload function.
 */
export function useDownloadChallenge({ downloadLink, technologie, challengeData, packageManager }: UseDlChallengeType): {
  startDownload: () => void
} {
  const updateStep = useAppStore((state) => state.updateDownloadStep)

  const [cacheFolder, setCacheFolder] = useState<DlChallengeReturn | null>(null)

  const challengePath = useAppStore((store) => store.config.challengePath)
  const dlWorkerRef = useRef<Worker | null>(null)

  useEffect(() => {
    const worker = new Worker(new URL("../workers/downloadWorker.ts", import.meta.url))
    dlWorkerRef.current = worker

    if (!challengeData?.challengeCachePath) {
      dlWorkerRef.current.onmessage = (event): void => {
        setCacheFolder(event.data)
      }
    } else {
      const cacheName = challengeData?.challengeCacheName ?? ""
      const cachePath = challengeData?.challengeCachePath ?? ""

      setCacheFolder({ cacheName, cachePath })
    }

    return (): void => {
      worker.terminate()
    }
  }, [])

  const startDownload = async (): Promise<void> => {
    try {
      if (!challengeData?.challengeCachePath) {
        updateStep("DOWNLOAD", "loading")
        await new Promise((resolve, reject) => {
          dlWorkerRef.current?.postMessage({
            downloadUrl: downloadLink,
            idChallenge: challengeData?.id
          })

          dlWorkerRef.current!.onmessage = (e): void => {
            if (e.data.success) resolve(true);
            else reject(new Error("Worker failed"));
          };
        })
        updateStep("DOWNLOAD", "completed")
      }

      const destinationDir = join(challengePath, cacheFolder?.cacheName ?? "")

      if (technologie !== "empty") {
        updateStep("BUILD", "loading")

        await buildStarter({
          framework: technologie ?? "empty",
          dirPath: destinationDir,
          packageManager: packageManager ?? "pnpm"
        })

        updateStep("BUILD", "completed")

        if (cacheFolder) {
          updateStep("MERGE", "completed")

          await mergeChallenge({
            destinationDir,
            originalDir: cacheFolder?.cachePath ?? "",
            framework: technologie ?? "empty"
          })

          updateStep("MERGE", "completed")
        }
      } else {
        updateStep("BUILD", "pending")
        copyPasteFolders({
          destinationDir,
          originalDir: cacheFolder?.cachePath ?? ""
        })
        updateStep("BUILD", "completed")
      }

    } catch (err) {
      throw new Error(`DOWNLOAD_FAILED ${err}`)
    }
  }

  return { startDownload }
}