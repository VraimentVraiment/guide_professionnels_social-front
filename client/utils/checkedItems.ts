export const getCheckedItems = (
  filtersCollections: FiltersCollection[],
  collectionName: string,
): FilterItemNode[] => {
  const checkedItems = filtersCollections
    ?.find((collection) => {
      return collection.collectionName === collectionName
    })
    ?.items
    ?.filter(item => item.checked)

  return checkedItems ?? []
}

export const useGetCheckedItems = (
  filtersCollections: Ref<FiltersCollection[]>,
) => {
  const checkedItems = computed(() => {
    return filtersCollections.value
      .map((collection) => {
        return {
          collectionName: collection.collectionName,
          items: collection.items.filter(item => item.checked),
        }
      })
  })

  return checkedItems
}
