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
    '~/layers/dsfr/styles/dsfr-icons-patch.scss',
  ],

  /**
   * @todo Add recommended dsfr analytics module
   */
  // app: {
  //   head: {
  //     script: [
  //       {
  //         // src: '@gouvfr/dsfr/dist/analytics/analytics.module.js',
  //       },
  //     ],
  //   },
  // },
})
