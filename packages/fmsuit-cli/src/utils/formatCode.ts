import prettier from "prettier"

interface FormatCodeType {
  code: string
  fileName: string
}

/**
 * Formats code using Prettier with appropriate parser based on file type.
 * Supports astro, html, and typescript/javascript files.
 * @param {FormatCodeType} options - Configuration object
 * @param {string} options.code - The code string to format
 * @param {string} options.fileName - The file name to determine the appropriate parser
 * @returns {Promise<string>} The formatted code, or the original code if formatting fails
 */
export async function formatCode({ code, fileName }: FormatCodeType): Promise<string> {
  const extension = fileName.split(".").pop()
  let parser = "babel-ts"

  if (extension === "astro") parser = "astro"
  if (extension === "html") parser = "html"

  try {
    return await prettier.format(
      code,
      {
        parser,
        plugins: ["prettier-plugin-astro"],
        semi: true,
        singleQuote: false,
        tabWidth: 2,
        htmlWhitespaceSensitivity: "ignore",
        printWidth: 120,
        bracketSameLine: true,
      }
    )
  } catch (err) {
    console.error(`Formatting error: ${err}`)
    return code
  }
}