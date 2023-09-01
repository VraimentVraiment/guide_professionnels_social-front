import { scaleLinear } from 'd3-scale'

/**
 * Reactive wrapper for d3-scale linear, which is used to create a linear mapping between an input domain and output range.
 * Both domain and range can be reactive.
 * Could be generalized to other d3-scale functions.
 */
export function useScaleLinear({
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
