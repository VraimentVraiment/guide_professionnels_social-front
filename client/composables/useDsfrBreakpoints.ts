import { useBreakpoints } from '@vueuse/core'

const BREAKPOINTS = {
  SM: 576,
  MD: 768,
  LG: 992,
  XL: 1248,
}

export function useDsfrBreakpoints() {

  const breakpoints = useBreakpoints(BREAKPOINTS)

  return {
    breakpoints,
  }
}
