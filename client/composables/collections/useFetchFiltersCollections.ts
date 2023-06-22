import { useArrayDifference } from '@vueuse/core'

export function useFetchFiltersCollections (
  filtersCollections: Ref<FiltersCollection[]>,
  postCollectionModel: Ref<CollectionModel | null>,
  directusFilters: ComputedRef<CollectionDirectusFilter[]>,
  cancelWatch: Ref<boolean>,
) {
  async function fetchFiltersCollections (): Promise<void> {
    cancelWatch.value = true
    const fetchedFiltersCollections = await Promise.all(
      getFiltersCollections(postCollectionModel.value, directusFilters),
    )

    for (const { items: fetchedItems, ...collection } of fetchedFiltersCollections) {
      const existingCollection = filtersCollections.value
        .find(c => c.collectionName === collection.collectionName)

      if (!existingCollection) {
        filtersCollections.value.push({ items: fetchedItems, ...collection })
      } else {
        const diff = useArrayDifference(existingCollection.items, fetchedItems, (v1, v2) => v1.id === v2.id)

        if (!diff.value.length) {
          continue
        }

        const existingItemsChecked = existingCollection.items
          .filter(item => item.checked)
          .map(item => item.id)

        existingCollection.items = fetchedItems

        for (const item of existingCollection.items) {
          if (existingItemsChecked.includes(item.id)) {
            item.checked = true
          }
        }
      }
    }

    cancelWatch.value = false
  }

  return fetchFiltersCollections
}

function getFiltersCollections (
  postCollectionModel: CollectionModel | null,
  directusFilters: ComputedRef<CollectionDirectusFilter[]>,
): Promise<FiltersCollection>[] {
  const filtersCollections = postCollectionModel?.relations
    ?.map(async (relationModel) => {
      const items = await useFetchCollectionItems<DirectusFilterItem>(
        relationModel.collectionName,
        directusFilters,
      )

      return {
        label: relationModel.label,
        collectionName: relationModel.collectionName,
        items: items
          ?.map((item) => {
            return {
              ...item,
              checked: false,
              relationModel,
            }
          }),
      }
    })

  return filtersCollections ?? []
}
