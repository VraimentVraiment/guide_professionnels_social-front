import VueDsfr from '@gouvminint/vue-dsfr'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueDsfr)
})
