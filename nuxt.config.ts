/**
 * @see https://nuxt.com/docs/getting-started/configuration
 */

export default defineNuxtConfig({
  srcDir: 'client/',
  modules: [
    'nuxt-directus',
    '@nuxt/content',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
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
  piniaPersistedstate: {
    storage: 'sessionStorage',
  },
  css: [
    '@/styles/index.scss',
    '@gouvfr/dsfr/dist/dsfr.min.css',
    '@gouvminint/vue-dsfr/styles', // Les styles propres aux composants de VueDsfr
    '@gouvfr/dsfr/dist/utility/icons/icons.min.css', // Facultatif: Si des icônes sont utilisées avec les classes "fr-icon-..."
    // '@gouvfr/dsfr/dist/scheme/scheme.min.css', // Facultatif: Si les thèmes sont utilisés (thème sombre, thème en bernes)
  ],
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
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
