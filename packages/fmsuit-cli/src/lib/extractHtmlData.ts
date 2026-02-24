import { parse } from "node-html-parser"

interface ReturnType {
  title: string
  style: string
  body: string
}

/**
 * Extracts HTML data from a file, parsing the title, style, and body content.
 * @param {{ path: string }} options - Configuration object
 * @param {string} options.path - Path to the HTML file to extract data from
 * @returns {Promise<ReturnType>} Object containing title, style, and body HTML content
 */
export async function extractHtmlData({ path }: { path: string }): Promise<ReturnType> {
  const html = await Bun.file(path).text()
  const root = parse(html, { comment: true })

  const styleNode = root.querySelector("head style");
  const bodyNode = root.querySelector("body");

  return {
    title: root.querySelector("title")?.innerText ?? "Frontend Mentor Challenge",
    style: styleNode?.toString().trim() ?? "",
    body: bodyNode?.innerHTML.trim() ?? ""
  }
}