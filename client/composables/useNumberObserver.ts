export function useNumberObserver ({
  defaultValue = 0,
} = {}) {
  const number = ref(defaultValue)

  const select = (n: number): void => {
    number.value = n
  }

  const isSelected = (n: number): boolean => {
    return number.value === n
  }

  return {
    number,
    select,
    isSelected,
  }
}