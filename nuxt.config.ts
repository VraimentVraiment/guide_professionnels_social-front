/**
 * @see https://nuxt.com/docs/getting-started/configuration
 */

export default defineNuxtConfig({
  srcDir: 'client/',
  modules: [
    '@pinia/nuxt',
    '@nuxt/content',
    'nuxt-directus',
  ],
  runtimeConfig: {
    public: {
      directus: {
        url: 'http://0.0.0.0:8055',
      },
    },
  },
  pinia: {
    autoImports: [
      'defineStore',
    ],
  },
  css: [
    '@gouvfr/dsfr/dist/dsfr.min.css',
    '@gouvminint/vue-dsfr/styles', // Les styles propres aux composants de VueDsfr
    '@gouvfr/dsfr/dist/utility/icons/icons.min.css', // Facultatif: Si des icônes sont utilisées avec les classes "fr-icon-..."
    // '@gouvfr/dsfr/dist/scheme/scheme.min.css', // Facultatif: Si les thèmes sont utilisés (thème sombre, thème en bernes)
  ],
  imports: {
    dirs: [
      'composables/**',
    ],
  },
  ignore: [
    '**/*.test.*',
    '**/*.spec.*',
    '**/*.cy.*',
  ],
})
