/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    '@nuxtjs/eslint-config-typescript',
  ],
  rules: {
    'comma-dangle': [2, 'always-multiline'],
    'vue/max-attributes-per-line': ['error', {
      singleline: 1,
      multiline: 1,
    }],
  },
  overrides: [
    // {
    //   files: [
    //     'cypress/support/*.{js,ts,jsx,tsx}',
    //     'cypress/integration/*.{spec,e2e}.{js,ts,jsx,tsx}',
    //     'src/**/*.ct.{js,ts,jsx,tsx}',
    //   ],
    //   extends: [
    //     'plugin:cypress/recommended',
    //   ],
    // },
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
