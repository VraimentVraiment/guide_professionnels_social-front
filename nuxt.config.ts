/**
 * @see https://nuxt.com/docs/getting-started/configuration
 */

import path from 'path'

export default defineNuxtConfig({
  srcDir: 'src/',

  sitemap: {
    urls: [
      'content/apropos',
      'content/contact',
      'content/accessibilite',
      'content/mentions-legales',
      'content/cookies',
      'content/donnees-personnelles',
    ],
  },
  devtools: {
    enabled: process.env.NODE_ENV === 'development',
  },

  extends: [
    './src/layers/dsfr',
  ],

  modules: [
    '@nuxt/content',
    '@nuxt/devtools',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    'nuxt-directus',
    'nuxt-simple-sitemap',
    'nuxt-vitest',
  ],

  runtimeConfig: {
    public: {
      siteTitle: 'GPS14',
      titleSeparator: '|',
      directus: {
        url: 'http://0.0.0.0:8055',
        // url: 'https://www.qualif.admin.gps.calvados.gouv.fr',
        // url: 'https://admin.gps.calvados.gouv.fr',
      },
    },
  },

  site: {
    url: 'http://localhost:3000',
    // url: 'https://www.qualif.gps.calvados.gouv.fr',
    // url: 'https://gps.calvados.gouv.fr',
  },

  piniaPersistedstate: {
    storage: 'sessionStorage',
  },

  css: [
    '@/styles/global.scss',
  ],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: [
            '@use "@/layers/dsfr/styles/" as dsfr;',
            '@use "@/styles/abstracts" as gps;',
          ].join('\n'),
        },
      },
    },
  },

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

  hooks: {
    /**
     * Here we override the main component to use for the app when running tests.
     * @see https://github.com/danielroe/nuxt-vitest/issues/295
     */
    'app:resolve': (app) => {
      if (String(process.env?.TEST) === 'true') {
        app.mainComponent = path.resolve(__dirname, './src/test-app.vue')
      }
    },
  },
})
