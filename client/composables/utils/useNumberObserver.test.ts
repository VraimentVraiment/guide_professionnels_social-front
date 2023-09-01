describe('useNumberObserver', () => {
  it('should initialize with a default value of 0', () => {
    const { number } = useNumberObserver()

    expect(number.value).toBe(0)
  })

  it('should set the number value', () => {
    const { number, set } = useNumberObserver()

    set(1)

    expect(number.value).toBe(1)
  })

  it('should check if the number value is equal to a given value', () => {
    const { number, is } = useNumberObserver()

    expect(is(0)).toBe(true)
    expect(is(1)).toBe(false)

    number.value = 1

    expect(is(0)).toBe(false)
    expect(is(1)).toBe(true)
  })

  it('should store the previous number value', () => {
    const { prevNumber, set } = useNumberObserver()

    set(1)

    expect(prevNumber.value).toBe(0)

    set(2)

    expect(prevNumber.value).toBe(1)
  })
})
