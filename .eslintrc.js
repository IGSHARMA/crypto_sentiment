module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended'
    ],
    plugins: ['@typescript-eslint', 'react', 'jsx-a11y'],
    rules: {
        '@typescript-eslint/no-explicit-any': 'error',
        'prefer-const': 'error',
        '@typescript-eslint/no-unused-vars': ['error', {
            'argsIgnorePattern': '^_',
            'varsIgnorePattern': '^_'
        }]
    },
    settings: {
        react: {
            version: 'detect'
        }
    }
};