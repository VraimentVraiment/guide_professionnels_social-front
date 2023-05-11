export const useFilterStore = defineStore('filters', () => {

  const collections = reactive<FiltersCollection[]>([])

  const rootNodes = computed(() => {
    return collections.map(stratifyFilters)
  })

  const fetchCollections = async (
    filterCollections: FilterCollection[],
  ) => {
    if (collections.length) {
      return;
    }
    collections.push(...(await Promise.all(
      filterCollections.map(fetchFilterCollection),
    )
    ))
  }

  const getItems = (
    collectionName: string,
  ) => {
    return collections?.find(
      collection => collection.name === collectionName,
    )?.items
  }

  const getRootNode = (
    collectionName: string,
  ) => {
    return rootNodes.value.find(
      node => node.data.name === collectionName,
    )
  }

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
    rootNodes,
    collections,
    fetchCollections,
    setItem,
    getItems,
    getRootNode,
  }
})