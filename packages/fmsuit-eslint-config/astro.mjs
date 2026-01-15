import eslintPluginAstro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  ...eslintPluginAstro.configs['jsx-a11y-recommended'],
  {
    files: ["**/*.astro"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: [".astro"],
      },
    },
    rules: {
      "astro/no-set-html-directive": "error",
    },
  },
]