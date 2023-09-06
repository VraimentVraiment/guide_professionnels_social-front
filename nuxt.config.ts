/**
 * @see https://nuxt.com/docs/getting-started/configuration
 */

import fs from 'fs'
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
    '@/styles/index.scss',
  ],

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  ignore: [
    '**/*.test.*',
    '**/*.spec.*',
    '**/*.cy.*',
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
})
