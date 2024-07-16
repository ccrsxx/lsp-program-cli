import eslint from '@eslint/js';
import tsEslint from 'typescript-eslint';
import globals from 'globals';

export default tsEslint.config(
  { ignores: ['build/*', 'coverage/*'] },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest
      },
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: import.meta.dirname
      }
    }
  },
  eslint.configs.recommended,
  ...tsEslint.configs.recommendedTypeChecked,
  {
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single', { avoidEscape: true }],
      'jsx-quotes': ['error', 'prefer-single'],
      'linebreak-style': ['error', 'unix'],
      'no-undef': 'off',
      'no-console': 'warn',
      'comma-dangle': ['error', 'never'],
      'no-unused-expressions': 'error',
      'no-constant-binary-expression': 'error',
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/consistent-type-exports': 'warn',
      '@typescript-eslint/consistent-type-imports': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { args: 'all', argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
      ],
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: { arguments: false }
        }
      ]
    }
  }
);
