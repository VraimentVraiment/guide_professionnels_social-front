export function useResetFilters (
  filtersCollections: Ref<FiltersCollection[]>,
) {
  function resetFilters () {
    filtersCollections.value
      .forEach((collection) => {
        collection.items
          .forEach((item) => {
            item.checked = false
          })
      })
  }
  return resetFilters
}
