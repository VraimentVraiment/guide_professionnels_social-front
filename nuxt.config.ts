/**
 * @see https://nuxt.com/docs/getting-started/configuration
 */

import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

export default defineNuxtConfig({
  srcDir: 'src/',

  devtools: {
    enabled: true,
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
    'nuxt-vitest',
  ],

  runtimeConfig: {
    public: {
      siteTitle: 'GPS14',
      titleSeparator: '|',
      directus: {
        url: 'http://0.0.0.0:8055',
      },
      directusCollectionsSchema: yaml.load(fs.readFileSync('src/content/collections.yml', 'utf8')),
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

    presets: [
      {
        from: 'd3-hierarchy',
        imports: [
          'HierarchyNode',
        ],
        type: true,
      },
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
