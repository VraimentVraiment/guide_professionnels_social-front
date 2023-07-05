import { scaleLinear } from 'd3-scale'
import { useWindowScroll } from '@vueuse/core'

export function useMaxHeight ({
  domain = [0, 450],
  range = [30, 80],
} = {}) {
  const { y } = useWindowScroll()

  const maxHeight = computed(() => {
    const scale = scaleLinear()
      .domain(domain.map(v => unref(v)))
      .range(range.map(v => unref(v)))
      .clamp(true)

    return `${scale(y.value)}vh`
  })

  return { maxHeight }
}
