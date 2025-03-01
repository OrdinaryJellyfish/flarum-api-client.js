/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    // Language options
    languageOptions: {
      parser: await import('@typescript-eslint/parser'),
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2022,
        sourceType: 'module'
      },
    },
    // Linting rules
    rules: {
      // ESLint core rules
      'no-console': 'off',
      'no-unused-vars': 'off', // TypeScript handles this
      
      // TypeScript rules
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
    // Files to lint
    files: ['src/**/*.ts'],
    // Files to ignore
    ignores: [
      'node_modules/**',
      'dist/**',
      'coverage/**',
    ],
    // Plugins
    plugins: {
      '@typescript-eslint': await import('@typescript-eslint/eslint-plugin')
    },
    // Settings
    settings: {}
  }
];