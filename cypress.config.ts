import { defineConfig } from 'cypress'

export default defineConfig({
  video: false,

  component: {
    viewportHeight: 500,
    viewportWidth: 1000,
    // setupNodeEvents (on, config) {},
    // specPattern: 'src/**/*.e2e.{js,ts}*',

    devServer: {
      framework: 'vue',
      bundler: 'vite',
      viteConfig: {
        configFile: 'vitest.config.ts',
      },
    },
  },

  e2e: {
    setupNodeEvents(/* on, config */) {
      // implement node event listeners here
    },
  },
})
