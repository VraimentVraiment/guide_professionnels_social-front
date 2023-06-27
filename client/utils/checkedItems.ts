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
