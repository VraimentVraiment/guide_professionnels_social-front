/**
 * @see https://nuxt.com/docs/getting-started/configuration
 */

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
