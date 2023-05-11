const fetchFilterCollection = async (
  collection: FiltersCollection,
) => {
  const items = (
    await useFetchDirectusItems<DirectusFilterItem>({
      collectionName: collection.name,
    })
  )
    .map((item) => {      return directusItemToFilterItem(item, collection.name)
    })

  const outCollection = {
    name: collection.name,
    label: collection.label,
    items,
  }
  const rootNode = stratifyFilters(outCollection)

  if (rootNode) {
    outCollection.rootNode = rootNode
  } else {
    console.error(
      `fetchCollection: rootNode is null for collection ${collection.name}`,
    )
  }

  return outCollection
}

export function useFilterStore(
  filterCollections: FiltersCollection[],
): FilterStore {
  const collections = reactive<FiltersCollection[]>([])

  const fetchAll = async () => {
    collections.push(...(
      await Promise.all(
        filterCollections.map(fetchFilterCollection),
      )
    ))
  }

  const isFetched = computed(() => {
    return collections.length > 0
  })

  const setItem = (collectionName, itemId, key, value) => {
    console.log('setItem', collectionName, itemId, key, value)
    const collection = collections.find(
      collection => collection.name === collectionName,
    )
    if (!collection) {
      console.error(
        `setItem: collection ${collectionName} not found in collections`,
      )
      return
    }

    const item = collection.items.find(item => item.id === itemId)
    if (!item) {
      console.error(
        `setItem: item ${itemId} not found in collection ${collectionName}`,
      )
      return
    }

    item[key] = value
  }

  return {
    collections,
    fetchAll,
    isFetched,
    setItem,
  }
}
