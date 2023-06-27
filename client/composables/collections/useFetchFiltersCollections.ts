export function useFetchFiltersCollection (
  filtersCollections: Ref<FiltersCollection[]>,
  postsCollectionModel: Ref<CollectionModel | null>,
  directusFilters: ComputedRef<CollectionDirectusFilter[]>,
) {
  async function fetchFiltersCollection (
    collectionName: string,
  ): Promise<void> {
    const fetchedCollection = await getFiltersCollection(postsCollectionModel.value, directusFilters, collectionName)

    if (!fetchedCollection) {
      return
    }

    const existingCollection = filtersCollections.value
      .find(c => c.collectionName === fetchedCollection.collectionName)

    if (!existingCollection) {
      filtersCollections.value.push(fetchedCollection)
    } else {
      const difference = useArrayDifference(existingCollection.items, fetchedCollection.items, el => el.id)
      if (!difference.hasChanges) {
        return
      }
      const existingItemsChecked = existingCollection.items
        .filter(item => item.checked)
        .map(item => item.id)

      existingCollection.items = fetchedCollection.items

      for (const item of existingCollection.items) {
        if (existingItemsChecked.includes(item.id)) {
          item.checked = true
        }
      }
    }
  }

  return fetchFiltersCollection
}

async function getFiltersCollection (
  postsCollectionModel: CollectionModel | null,
  directusFilters: ComputedRef<CollectionDirectusFilter[]>,
  collectionName: string,
): Promise<FiltersCollection | null> {
  const relationModel = postsCollectionModel?.relations
    ?.find(r => r.collectionName === collectionName)

  if (!relationModel) {
    return null
  }

  const items = await useFetchCollectionItems<DirectusFilterItem>(
    relationModel.collectionName,
    directusFilters,
  )

  return {
    label: relationModel.label,
    collectionName: relationModel.collectionName,
    items: items
      ?.map(item => initialFilterItemState(item, relationModel)),
  }
}

function initialFilterItemState (
  item: DirectusFilterItem,
  relationModel: CollectionRelationModel,
): FilterItemNode {
  return {
    ...item,
    checked: false,
    relationModel,
  }
}
