/**
 * @see https://nuxt.com/docs/getting-started/configuration
 */

export default defineNuxtConfig({
  srcDir: 'client/',
  modules: [
    '@nuxt/content',
    'nuxt-directus',
  ],
  css: [
    '@gouvfr/dsfr/dist/core/core.main.min.css', // Le CSS du DSFR
    '@gouvfr/dsfr/dist/component/component.main.min.css', // Styles de tous les composants du DSFR
    '@gouvfr/dsfr/dist/utility/utility.main.min.css', // Classes utilitaires: les composants de VueDsfr en ont besoin
    '@gouvminint/vue-dsfr/styles', // Les styles propres aux composants de VueDsfr
    
    // '@gouvfr/dsfr/dist/scheme/scheme.min.css', // Facultatif: Si les thèmes sont utilisés (thème sombre, thème en bernes)
    // '@gouvfr/dsfr/dist/utility/icons/icons.min.css', // Facultatif: Si des icônes sont utilisées avec les classes "fr-icon-..."
  ],
  ignore: [
    '**/*.test.*',
    '**/*.spec.*',
    '**/*.cy.*',
  ],
  runtimeConfig: {
    public: {
      directus: {
        url: 'http://0.0.0.0:8055',
      },
    },
  },
})
