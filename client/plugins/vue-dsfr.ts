// import VueDsfr from '@gouvminint/vue-dsfr'

// export default defineNuxtPlugin((nuxtApp) => {
//   nuxtApp.vueApp.use(VueDsfr)
// })


import VueDsfr from '@gouvminint/vue-dsfr'

import {
  RiRoadMapFill,
  RiMenu2Fill,
  RiEqualizerFill,
  RiAlarmWarningLine,
} from 'oh-vue-icons/icons/ri/index'

const icons = [
  RiRoadMapFill,
  RiMenu2Fill,
  RiEqualizerFill,
  RiAlarmWarningLine,
]

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueDsfr, { icons })
})