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

  const resetFilters = useResetFilters(filtersCollections)
  const setItem = useSetItem(postsCollectionName, filtersCollections)
  const fetchCollection = useFetchCollection(postsCollectionName, collections, directusFilters)
  const watchPostFiltering = useWatchPostFiltering(postsCollectionName, filtersCollections, fetchCollection)

  return {
    postsCollectionName,
    postsCollection,
    collections,
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
