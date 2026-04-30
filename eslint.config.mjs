import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  /* ============================================
     1. GLOBAL IGNORES (replaces .eslintignore)
     ============================================ */
  {
    ignores: [
      'node_modules/',
      'dist/',
      'coverage/',
      'eslint.config.mjs',
      '.env',
      '.env.local',
    ],
  },

  /* ============================================
     2. BASE CONFIGURATIONS
     ============================================ */
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,

  /* ============================================
     3. MAIN CONFIGURATION FOR TYPESCRIPT FILES
     ============================================ */
  {
    files: ['src/**/*.ts', 'test/**/*.ts'],

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'unused-imports': unusedImports,
    },

    rules: {
      /* ============================================
         General Rules
         ============================================ */
      'no-useless-escape': 'off',
      'no-duplicate-imports': 'error',
      'object-shorthand': ['error', 'always'],
      'max-depth': ['error', 4],

      /* ============================================
         TypeScript Rules
         ============================================ */
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',

      /* ============================================
         Prettier Integration
         ============================================ */
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
          semi: false,
          singleQuote: true,
          trailingComma: 'all',
          bracketSpacing: true,
          arrowParens: 'always',
          printWidth: 100,
          tabWidth: 4,
          useTabs: false,
        },
      ],

      /* ============================================
         Unused Imports Detection
         ============================================ */
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
);
