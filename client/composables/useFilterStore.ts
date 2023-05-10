export function useFilterStore(
  filterCollections: FiltersCollection[],
): FilterStore {
  const collections = reactive<FiltersCollection[]>([])

  const fetchAll = async () => {
    const collectionItems = await Promise.all(
      filterCollections.map(async (collection) => {
        const items = (
          await useFetchDirectusItems<DirectusFilterItem>({
            collectionName: collection.name,
          })
        )
          .map((item) => {
            return DirectusItemToFilterItem(item, collection.name)
          })

        return {
          name: collection.name,
          label: collection.label,
          items,
        }
      }),
    )

    collections.push(...collectionItems)
  }

  return {
    collections,
    fetchAll,
  }
}
