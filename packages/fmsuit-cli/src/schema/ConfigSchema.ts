import { z } from "zod"

export const ConfigSchema = z.object({
  challengePath: z.string().min(2).default(process.cwd())
})