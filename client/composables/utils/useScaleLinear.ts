import { scaleLinear } from 'd3-scale'

export function useScaleLinear ({
  value,
  domain,
  range,
}: {
  value: Ref<number> | number
  domain: Ref<number>[] | number[]
  range: Ref<number>[] | number[]
}) {
  const result = computed(() => {
    const scale = scaleLinear()
      .domain(domain.map(v => unref(v)))
      .range(range.map(v => unref(v)))
      .clamp(true)

    return scale(unref(value))
  })

  return {
    result,
  }
}
