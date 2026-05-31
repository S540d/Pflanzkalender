// @ts-check
const js = require('@eslint/js');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const prettierConfig = require('eslint-config-prettier');

const globals = {
  console: 'readonly',
  process: 'readonly',
  require: 'readonly',
  module: 'readonly',
  exports: 'writable',
  __dirname: 'readonly',
  __filename: 'readonly',
  global: 'readonly',
  setTimeout: 'readonly',
  clearTimeout: 'readonly',
  setInterval: 'readonly',
  clearInterval: 'readonly',
  Promise: 'readonly',
  fetch: 'readonly',
  Buffer: 'readonly',
  URL: 'readonly',
  Blob: 'readonly',
  FileReader: 'readonly',
  document: 'readonly',
  alert: 'readonly',
};

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals,
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-require-imports': 'off',
      'no-console': ['warn', { allow: ['error', 'warn'] }],
    },
    settings: {
      react: { version: 'detect' },
    },
  },
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    languageOptions: { globals },
  },
  {
    files: ['public/**/*.js'],
    languageOptions: {
      globals: {
        ...globals,
        self: 'readonly',
        caches: 'readonly',
        fetch: 'readonly',
        navigator: 'readonly',
        location: 'readonly',
        addEventListener: 'readonly',
        clients: 'readonly',
        importScripts: 'readonly',
        skipWaiting: 'readonly',
        event: 'readonly',
        Request: 'readonly',
        Response: 'readonly',
        URL: 'readonly',
      },
    },
  },
  {
    files: ['src/**/*.{ts,tsx}', 'utils/**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals,
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        navigator: 'readonly',
        alert: 'readonly',
        Blob: 'readonly',
        MediaQueryList: 'readonly',
        MediaQueryListEvent: 'readonly',
        Event: 'readonly',
        HTMLInputElement: 'readonly',
        __DEV__: 'readonly',
        caches: 'readonly',
      },
    },
  },
  {
    files: ['__tests__/**/*.{ts,tsx,js}', '**/*.test.{ts,tsx,js}', '**/*.spec.{ts,tsx,js}'],
    languageOptions: {
      globals: {
        ...globals,
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
    },
  },
  prettierConfig,
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'web-build/**',
      '.expo/**',
      'coverage/**',
      'scripts/**',
      'jest.config.js',
      '__mocks__/**',
    ],
  },
];
