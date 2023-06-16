import { useArrayDifference } from "@vueuse/core"

export function useFetchFiltersCollections(
  filtersCollections: Ref<FiltersCollection[]>,
  postCollectionModel: Ref<CollectionModel | null>,
  directusFilters,
  cancelWatch: Ref<boolean>,
) {
  async function fetchFiltersCollections(): Promise<void> {
    cancelWatch.value = true
    const fetchedCollections = await Promise.all(
      getFiltersCollections(postCollectionModel.value, directusFilters),
    )

    for (const { items: fetchedItems, ...collection } of fetchedCollections) {
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

  return fetchFiltersCollections;
}


function getFiltersCollections(
  postCollectionModel: CollectionModel | null,
  directusFilters,
): Promise<FiltersCollection>[] {
  return postCollectionModel?.relations
    ?.map((relationModel) => {

      const directusFilter = directusFilters.value
        ?.find((filter) => {
          return filter.collectionName === relationModel.collectionName
        })?.filter ?? {} as Record<string, unknown>

      return getInitialFilterCollection(relationModel, directusFilter)
    }) ?? []
}

async function getInitialFilterCollection(
  relationModel: CollectionRelationModel,
  directusFilter,
): Promise<FiltersCollection> {
  const items = await useFetchDirectusItems<DirectusFilterItem>({
    collectionName: relationModel.collectionName,
    params: {
      filter: directusFilter,
    },
  })
  return {
    ...relationModel,
    items: items.map(directusFilterItemToFilterItemNode),
  }

  function directusFilterItemToFilterItemNode(
    item: DirectusFilterItem,
  ): FilterItemNode {
    return {
      ...item,
      checked: false,
      relationModel,
    }
  }
}