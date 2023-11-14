import { expect } from 'vitest'

describe('useScaleLinear', () => {
  it('should create a linear scale with the given domain and range', () => {
    const value = ref(75)
    const domain = [ref(0), ref(100)]
    const range = [ref(0), ref(1)]

    const { result } = useScaleLinear({ value, domain, range })
    expect(result.value).toBe(0.75)
  })

  it('should update the scale when the domain or range changes', () => {
    const value = ref(75)
    const domain = [ref(0), ref(100)]
    const range = [ref(0), ref(1)]

    const { result } = useScaleLinear({ value, domain, range })

    domain[0].value = 50
    expect(result.value).toBe(0.5)

    range[1].value = 2
    expect(result.value).toBe(1)
  })

  it('should update the scale when the value changes', () => {
    const value = ref(50)
    const domain = [ref(0), ref(100)]
    const range = [ref(0), ref(1)]

    const { result } = useScaleLinear({ value, domain, range })

    value.value = 75
    expect(result.value).toBe(0.75)

    value.value = 25
    expect(result.value).toBe(0.25)
  })
})
