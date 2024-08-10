import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import reactRefresh from 'eslint-plugin-react-refresh';
import hooksPlugin from 'eslint-plugin-react-hooks';
import { fixupPluginRules } from '@eslint/compat';

export default [
    { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
    {
        languageOptions: {
            globals: { ...globals.browser, ...globals.es2024 },
            sourceType: 'module',
            parserOptions: { ecmaVersion: 'latest', ecmaFeatures: { jsx: true } },
        },
        plugins: {
            'react-refresh': reactRefresh,
            'react-hooks': fixupPluginRules(hooksPlugin), // react-hooks do not yet support eslint v9. @eslint/compat can be removed when it does
        },
        rules: {
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-inferrable-types': 'off',
            'react/prop-types': [0],
            'react-hooks/exhaustive-deps': 'warn',
            'react-hooks/rules-of-hooks': 'error',
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
        },
        settings: { react: { version: 'detect' } },
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
    eslintPluginPrettierRecommended,
];
