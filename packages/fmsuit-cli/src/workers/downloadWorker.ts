import { downloadChallenge } from '@lib/downloadChallenge'

self.onmessage = async (event): Promise<void> => {
  const { downloadUrl, idChallenge } = event.data as {
    downloadUrl: string
    idChallenge: number
  }

  try {
    const result = await downloadChallenge({
      downloadUrl,
      idChallenge,
    })

    self.postMessage({ success: true, result })
  } catch (err) {
    self.postMessage({ success: false, error: (err as Error).message })
  }
}
