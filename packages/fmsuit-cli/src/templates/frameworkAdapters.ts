interface DataType {
  title: string
  style?: string
  body: string
}

type ReturnType = {
  file: string
  code: string
}[]

export const frameworkAdapters = {
  vite: (data: DataType): ReturnType => [
    {
      file: 'index.html',
      code: `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${data.title}</title>
    <!-- Feel free to remove these styles or customise in your own stylesheet 👍 -->
    ${data.style}
  </head>
  <body>
    <div id="app">
      ${data.body}
    </div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
      `,
    },
  ],
  nextjs: (data: DataType): ReturnType => {
    const jsxBody = data.body.replaceAll('class=', 'className=')

    return [
      {
        file: 'page.tsx',
        code: `
export const metadata = {
  title: '${data.title}',
};

export default function Home() {
  return (
    <>
      {/* Feel free to remove these styles or customise in your own stylesheet 👍 */}
      ${data.style}
      ${jsxBody}
    </>
  );
};
    `,
      },
    ]
  },
  astro: (data: DataType): ReturnType => [
    {
      file: 'index.astro',
      code: `
---
import Layout from '../layouts/Layout.astro';
---

<Layout>
	${data.body}
</Layout>
<!-- Feel free to remove these styles or customise in your own stylesheet 👍 -->
${data.style}
        `,
    },
    {
      file: 'Layout.astro',
      code: `
<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width" />
		<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
		<link rel="icon" href="/favicon.ico" />
		<title>${data.title}</title>
	</head>
	<body>
		<slot />
	</body>
</html>

<style>
	html,
	body {
		margin: 0;
		width: 100%;
		height: 100%;
	}
</style>
        `,
    },
  ],
}
