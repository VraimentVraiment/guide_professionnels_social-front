import VueDsfr from '@gouvminint/vue-dsfr'

import {
  RiRoadMapFill,
  RiMenu2Fill,
  RiEqualizerFill,
  RiAlarmWarningLine,
  RiCloseCircleLine,
} from 'oh-vue-icons/icons/ri/index'

const icons = [
  RiRoadMapFill,
  RiMenu2Fill,
  RiEqualizerFill,
  RiAlarmWarningLine,
  RiCloseCircleLine,
  // fr-icon-close-line
]

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueDsfr, { icons })
})
