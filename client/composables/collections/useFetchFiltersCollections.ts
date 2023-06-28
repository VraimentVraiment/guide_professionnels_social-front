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
      const difference = useArrayDifference(existingCollection.items, fetchedCollection.items, (el: FilterItemNode) => el.id)
      if (difference.hasChanges) {
        updateCollection(existingCollection, fetchedCollection.items)
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
      ?.map(item => getInitialFilterItemNode(item, relationModel)),
  }
}

function updateCollection (
  collection: FiltersCollection,
  items: FilterItemNode[],
): void {
  const existingItemsChecked = collection.items
    .filter(item => item.checked)
    .map(item => item.id)

  collection.items = items

  for (const item of collection.items) {
    if (
      existingItemsChecked.includes(item.id) &&
      !item.checked
    ) {
      item.checked = true
    }
  }
}
