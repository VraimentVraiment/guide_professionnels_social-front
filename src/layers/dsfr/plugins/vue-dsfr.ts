import VueDsfr from '@gouvminint/vue-dsfr'

import {
  RiRoadMapFill,
  RiMenu2Fill,
  RiEqualizerFill,
  RiAlarmWarningLine,
  RiCloseCircleLine,
  RiSendPlaneLine,
  RiLogoutBoxLine,
  RiContrast2Line,
  RiEditLine,
} from 'oh-vue-icons/icons/ri/index'

const icons = [
  RiRoadMapFill,
  RiMenu2Fill,
  RiEqualizerFill,
  RiAlarmWarningLine,
  RiCloseCircleLine,
  RiSendPlaneLine,
  RiLogoutBoxLine,
  RiContrast2Line,
  RiEditLine,
]

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueDsfr, { icons })
})
