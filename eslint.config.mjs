import configPrettier from 'eslint-config-prettier';
import prettier from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt({
    plugins: {
        'simple-import-sort': simpleImportSort,
        prettier: prettier,
    },
    rules: {
        'prettier/prettier': 'error',
        quotes: ['error', 'single'],
        'require-await': 'error',

        'simple-import-sort/imports': [
            'error',
            {
                groups: [
                    // 1️⃣ Bibliotecas (Nuxt/Vue vem primeiro)
                    ['^vue', '^nuxt', '^@?\\w'],
                    // 2️⃣ Alias @/ e ~ (Nuxt usa muito o ~ também)
                    ['^@', '^~'],
                    // 3️⃣ ../ (parent)
                    ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
                    // 4️⃣ ./ (sibling)
                    ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
                    // 5️⃣ Styles
                    ['^.+\\.module\\.(css|scss)$', '^.+\\.(css|scss)$'],
                ],
            },
        ],

        '@typescript-eslint/no-explicit-any': 'off',
        'comma-dangle': [
            'error',
            {
                arrays: 'only-multiline',
                objects: 'only-multiline',
                imports: 'only-multiline',
                exports: 'only-multiline',
                functions: 'only-multiline',
            },
        ],

        ...configPrettier.rules,
    },
});
