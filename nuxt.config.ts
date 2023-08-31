/**
 * @see https://nuxt.com/docs/getting-started/configuration
 */

export default defineNuxtConfig({
  srcDir: 'client/',
  extends: [
    './layers/dsfr',
  ],
  modules: [
    'nuxt-directus',
    '@nuxt/content',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
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
