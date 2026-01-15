import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

/** @type {import("eslint").Linter.Config[]} */
export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...Object.fromEntries(Object.entries(globalThis).map(([k]) => [k, 'readonly'])),
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "no-console": "off",
      "@typescript-eslint/explicit-function-return-type": "warn",
    },
  },
  {
    files: ["bin/*.ts", "src/index.ts"],
    rules: {
      "no-process-exit": "off",
    }
  }
);