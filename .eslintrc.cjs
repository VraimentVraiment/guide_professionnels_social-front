/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    '@nuxtjs/eslint-config-typescript',
  ],
  rules: {
    'space-before-function-paren': ['error', 'never'],
    'comma-dangle': [2, 'always-multiline'],
    'vue/max-attributes-per-line': ['error', {
      singleline: 1,
      multiline: 1,
    }],
  },
  overrides: [
    {
      files: [
        'client/**/*.{spec,test}.{js,ts,jsx,tsx}',
      ],
      env: {
        jest: true,
      },
    },
  ],
}
