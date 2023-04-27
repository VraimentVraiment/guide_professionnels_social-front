export function useTabIndex (): TabIndexModel {
  const selected = ref(0)

  const select = (index: number): void => {
    selected.value = index
  }

  const isSelected = (index: number): boolean => {
    return selected.value === index
  }

  return {
    selected,
    select,
    isSelected,
  }
}
