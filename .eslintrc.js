/* eslint-disable import/no-commonjs */

module.exports = {
  env: {
    es6: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:json/recommended-with-comments',
    'plugin:markdown/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: ['import', 'simple-import-sort'],
  rules: {
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-amd': 'error',
    'import/no-commonjs': 'error',
    'import/no-default-export': 'error',
    'import/no-duplicates': 'error',
    'import/no-mutable-exports': 'error',
    'import/no-unassigned-import': 'error',
    'import/order': 'off',

    'no-undefined': 'error',
    'object-shorthand': 'error',

    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': 'error',

    'sort-imports': 'off'
  }
};
