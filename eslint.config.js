const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
  ...expoConfig,
  prettierConfig,
  {
    ignores: ['node_modules/**', '.expo/**', 'dist/**', 'android/**', 'ios/**', 'backend/**'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // strict mode zaten tsconfig'de zorunlu; burada ek olarak `any`
      // kullanımını da açıkça yasaklıyoruz.
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
];
