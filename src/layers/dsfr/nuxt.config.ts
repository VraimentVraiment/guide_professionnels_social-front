/**
 * @see https://nuxt.com/docs/getting-started/configuration
 */

export default defineNuxtConfig({
  css: [
    '@gouvfr/dsfr/dist/dsfr.min.css',
    '@gouvminint/vue-dsfr/styles', // Les styles propres aux composants de VueDsfr
    /**
     * Importing icons.min.css causes Maximum call stack exceeded with current configuration
     */
    // '@gouvfr/dsfr/dist/utility/icons/icons.min.css', // Facultatif: Si des icônes sont utilisées avec les classes "fr-icon-..."
    // '@gouvfr/dsfr/dist/scheme/scheme.min.css', // Facultatif: Si les thèmes sont utilisés (thème sombre, thème en bernes)
  ],
  /**
   * @todo Add recommended dsfr analytics module
   */
  // app: {
  //   head: {
  //     script: [
  //       {
  //         src: '/dist/analytics/analytics.module.js',
  //       },
  //     ],
  //   },
  // },
})
