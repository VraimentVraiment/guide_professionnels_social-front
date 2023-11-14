/**
 * Given several collections of checked items, this composable provides
 * reactive methods to observe and reset those items.
 */
export function useCheckedItemsObserver(
  checkedItems: Ref<FiltersCollection[]>,
) {
  const resetCollection = (collectionName: string) => {
    unref(checkedItems)
      .find(collection => collection.collectionName === collectionName)
      ?.items
      .forEach((item) => {
        item.checked = false
      })
  }

  const resetAll = () => {
    unref(checkedItems)
      ?.forEach((collection) => {
        collection.items
          .forEach((item) => {
            item.checked = false
          })
      })
  }

  const hasCheckedItems = computed(() => {
    return (
      unref(checkedItems)
        ?.some((collectionCheckedItems) => {
          return collectionCheckedItems.items.length > 0
        })
    )
  })

  const hasCollectionCheckedItems = (collectionName: string) => {
    return (
      unref(checkedItems)
        ?.find((collection) => {
          return collection.collectionName === collectionName
        })
        ?.items.some((item) => {
          return item.checked
        })
    )
  }

  return {
    resetCollection,
    resetAll,
    hasCheckedItems,
    hasCollectionCheckedItems,
  }
}
