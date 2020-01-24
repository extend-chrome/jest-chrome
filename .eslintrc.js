/* ----------------------------------------------------------- */
/*                      ESLINT BASE RULES                      */
/* ----------------------------------------------------------- */

const rules = {
  '@typescript-eslint/camelcase': 'off',
  '@typescript-eslint/explicit-function-return-type': 'off',
  '@typescript-eslint/member-delimiter-style': [
    'error',
    {
      multiline: {
        delimiter: 'none',
        requireLast: false,
      },
      singleline: {
        delimiter: 'semi',
        requireLast: false,
      },
    },
  ],
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-non-null-assertion': 'off',
  '@typescript-eslint/no-unused-vars': [
    'warn',
    {
      args: 'after-used',
      ignoreRestSiblings: true,
      vars: 'all',
    },
  ],
  '@typescript-eslint/no-use-before-define': [
    'error',
    {
      classes: true,
      functions: false,
    },
  ],
  '@typescript-eslint/no-var-requires': 'off',
  '@typescript-eslint/unbound-method': 'off',
}

/* ----------------------------------------------------------- */
/*                          OVERRIDES                          */
/* ----------------------------------------------------------- */

const dDotTsFiles = {
  files: ['**/*.d.ts'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  rules: {
    ...rules,
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
  },
}

const jest = {
  files: [
    '**/*.test.ts',
    '**/*.test.tsx',
    'tests/**/*.ts',
    '**/__mocks__/**/*.ts',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    // 'plugin:jest/recommended', // requires no use of power-assert
    // 'plugin:jest/all', // adds style rules
  ],
  rules: {
    ...rules,
    'no-restricted-globals': 'off',
    '@typescript-eslint/require-await': 'off',
    '@typescript-eslint/no-empty-function': 'off',
  },
  plugins: ['jest'],
}

const ts = {
  files: ['**/*.ts'],
  env: {
    es6: true,
    node: true,
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    'jest/globals': true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    // 'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    ...rules,
  },
  // File matching patterns should go from general to specific
  overrides: [jest, dDotTsFiles],
}

/* ----------------------------------------------------------- */
/*                     FINAL ESLINT CONFIG                     */
/* ----------------------------------------------------------- */

module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {},
  overrides: [ts],
}
