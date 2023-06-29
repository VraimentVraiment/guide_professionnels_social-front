import { useBreakpoints } from '@vueuse/core'

/**
 * Breakpoints used in DSFR
 * @see https://www.systeme-de-design.gouv.fr/elements-d-interface/fondamentaux-techniques/grille-et-points-de-rupture
 */
const BREAKPOINTS = {
  SM: 576,
  MD: 768,
  LG: 992,
  XL: 1248,
}

export function useDsfrBreakpoints () {
  const breakpoints = useBreakpoints(BREAKPOINTS)

  return {
    breakpoints,
  }
}
