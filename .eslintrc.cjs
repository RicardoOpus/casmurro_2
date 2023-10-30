module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jest/recommended',
    'airbnb',
    'airbnb/hooks',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'vite.config.ts'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/jsx-filename-extension': [1, { extensions: ['.tsx'] }],
    'react/react-in-jsx-scope': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/no-absolute-path': 'off',
  },
}
