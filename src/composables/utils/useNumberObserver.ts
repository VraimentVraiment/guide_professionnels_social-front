/**
 * Provides a reactive observer for managing a number value.
 */
export function useNumberObserver({
  defaultValue = 0,
} = {}) {
  const number = ref(defaultValue)
  const prevNumber = ref(defaultValue)

  const set = (value: number): void => {
    prevNumber.value = number.value
    number.value = value
  }

  const is = (value: number): boolean => {
    return number.value === value
  }

  return {
    number,
    prevNumber,
    set,
    is,
  }
}
