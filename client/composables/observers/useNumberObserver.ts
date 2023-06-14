export function useNumberObserver ({
  defaultValue = 0,
} = {}) {
  const number = ref(defaultValue)
  const prevNumber = ref(defaultValue)

  const select = (value: number): void => {
    prevNumber.value = number.value
    number.value = value
  }

  const isSelected = (value: number): boolean => {
    return number.value === value
  }

  return {
    number,
    prevNumber,
    select,
    isSelected,
  }
}