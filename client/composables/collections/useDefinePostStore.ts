export const useDefinePostStore = () => {
  const {
    postsCollectionName,
    postsCollection,
    collections,
    filtersCollections,
    relationsCollections,
    setPostCollection,
  } = useCollections()

  const rootNodes = useRootNodes(postsCollectionName, filtersCollections)
  const directusFilters = useDirectusFilters(filtersCollections, relationsCollections)

  const fetchCollection = useFetchCollection(postsCollectionName, collections, directusFilters)
  const setItem = useSetItem(postsCollectionName, filtersCollections)
  const resetFilters = useResetFilters(filtersCollections)
  const watchPostFiltering = useWatchPostFiltering(postsCollectionName, filtersCollections, fetchCollection)

  return {
    postsCollectionName,
    collections,
    postsCollection,
    filtersCollections,
    relationsCollections,
    rootNodes,
    directusFilters,
    setPostCollection,
    fetchCollection,
    resetFilters,
    setItem,
    watchPostFiltering,
  }
}
