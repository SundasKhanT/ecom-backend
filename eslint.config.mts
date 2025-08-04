import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // Load the recommended config from @typescript-eslint plugin with compatibility helper
  ...compat.extends('plugin:@typescript-eslint/recommended'),
  {
    rules: {
      // example custom rules
      semi: ['error', 'always'],
      '@typescript-eslint/no-unused-vars': ['warn'],
    },
  },
];
