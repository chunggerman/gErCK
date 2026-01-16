import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: globals.node,
    },
    rules: {
      // Add custom rules here if needed
    },
  },
  {
    files: ['src/repositories/interfaces/*.js', 'src/services/*.js'],
    rules: {
      'no-unused-vars': 'off',
    },
  },
];
