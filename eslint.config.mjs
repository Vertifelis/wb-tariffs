// @ts-check
import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import prettierRecommended from "eslint-plugin-prettier/recommended";
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default defineConfig(
  eslint.configs.recommended,
  prettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },
  {
    files: ['**/*.ts', '**/*.mts', '**/*.cts'],
    extends: [
      ...tseslint.configs.recommendedTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
    },
  },
  {
    files: ['**/*.js', '**/*.ts', '**/*.cjs', '**/*.mjs', '**/*.mts', '**/*.cts'],
    rules: {
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],
    },
  },
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'eslint.config.mjs',
    ],
  },
);