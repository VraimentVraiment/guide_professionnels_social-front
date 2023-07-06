export const useDefinePostStore = () => {
  const searchStore = useSearchStore()

  const {
    postsCollectionName,
    postsCollection,
    collections,
    filtersCollections,
    relationsCollections,
    setPostCollection,
  } = useCollections()

  const rootNodes = useRootNodes(postsCollectionName, filtersCollections)
  const checkedItems = useGetCheckedItems(filtersCollections)
  const directusFilters = useDirectusFilters(postsCollectionName, filtersCollections, checkedItems, relationsCollections)
  // const directusFilters = useDirectusFilters(postsCollectionName, filtersCollections, checkedItems, relationsCollections, relationGroups)
  const relationGroups = useRelationGroups(relationsCollections)

  const fetchCollection = useFetchCollection(postsCollectionName, collections, directusFilters)
  const setItem = useSetItem(postsCollectionName, filtersCollections)
  const watchPostFiltering = useWatchPostFiltering(postsCollectionName, filtersCollections, fetchCollection)

  const postItems = computed(() => {
    const items = postsCollection?.value?.items || []

    if (!searchStore.selectedCityList?.length) {
      return items
    }

    return items
      ?.filter((post) => {
        return addressMatch(post.addresses, searchStore.selectedCityList)
      })
  })

  return {
    postsCollectionName,
    collections,
    postsCollection,
    filtersCollections,
    relationsCollections,
    rootNodes,
    checkedItems,
    directusFilters,
    relationGroups,
    postItems,
    setPostCollection,
    fetchCollection,
    setItem,
    watchPostFiltering,
  }
}
