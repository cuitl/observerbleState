module.exports = {
  root: true,
  globals: {
    JSX: 'readonly',
  },
  env: {
    browser: true,
    amd: true,
    es2021: true,
    node: true,
  },

  settings: {
    react: {
      version: 'detect',
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    // https://github.com/import-js/eslint-plugin-import
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      // https://github.com/alexgorbatchev/eslint-import-resolver-typescript
      typescript: {
        alwaysTryTypes: true,
        project: 'packages/*/tsconfig.json',
      },
    },
  },

  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },

  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
  ],
  plugins: ['simple-import-sort'],

  rules: {
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',

    // 'no-unused-vars': ['warn'],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn'],
    '@typescript-eslint/no-explicit-any': 'off',

    // plugin:import/recommended
    'import/no-unresolved': ['warn'],
    // simple-import-sort config
    'simple-import-sort/imports': ['warn'],
    'simple-import-sort/exports': ['warn'],
    'import/first': ['warn'],
    'import/newline-after-import': ['warn'],
    'import/no-duplicates': ['warn'],
  },
}
