module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true
    },
    extends: [ 'eslint:recommended' ],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
    },
    rules: {
        'default-param-last': 'off',
        'import/order': 'off',
        'import/extensions': 'off',
        'import/no-unresolved': 'off',
        'max-len': [
            'error',
            {
                'code': 150,
                'ignoreUrls': true
            }
        ],
        'no-shadow': 'off',
        'no-underscore-dangle': 'off',
        'jsx-no-lambda': 'off',
        'semi': ['error', 'always'],
        'object-shorthand': 'error',
        'quotes': ['error', 'single'],
        'member-ordering': 'off',
        'object-literal-sort-keys': 'off',
        'no-shadowed-variable': 'off',
        'no-consecutive-blank-lines': 'off',
        'no-string-literal': 'off',
        'jsx-no-multiline-js': 'off',
        'jsx-boolean-value': 'off',
        'arrow-parens': 'off',
        'no-implicit-dependencies': 'off',
        'no-submodule-imports': 'off',
        'no-case-declarations': 'warn',
        'jsx-alignment': 'off',
        'jsx-wrap-multiline': 'off',
        'arrow-body-style': 'off',
        'class-methods-use-this': 'off',
        'import/imports-first': 'off',
        'import/newline-after-import': 'off',
        'import/no-dynamic-require': 'off',
        'import/no-extraneous-dependencies': 'off',
        'import/no-named-as-default': 'off',
        'import/no-webpack-loader-syntax': 'off',
        'import/prefer-default-export': 'off',
        'linebreak-style': 'off',
        'operator-linebreak': ['error', 'after'],
        'no-param-reassign': 'off',
        'no-unused-vars': 'off',
        'indent': [
            'error',
            4,
            {
                'SwitchCase': 1,
                'ignoredNodes': [
                    'TemplateLiteral'
                ]
            }
        ],
        'array-callback-return': 'off',
        'newline-per-chained-call': 'off',
        'no-confusing-arrow': 'off',
        'no-console': 'off',
        'no-debugger': 'warn',
        'no-use-before-define': 'off',
        'object-curly-newline': ['error', {
            'ImportDeclaration': { 'multiline': true, 'minProperties': 5 },
            'ExportDeclaration': { 'multiline': true, 'minProperties': 5 }
        }],
        'prefer-template': 'error',
        'no-plusplus': 'off',
        'prefer-promise-reject-errors': 'off',
        'template-curly-spacing': 'off',
        'object-curly-spacing': ['error', 'always']
    },
};
