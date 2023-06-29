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
  const checkedItems = useGetCheckedItems(filtersCollections)
  const directusFilters = useDirectusFilters(filtersCollections, checkedItems, relationsCollections)

  const fetchCollection = useFetchCollection(postsCollectionName, collections, directusFilters)
  const setItem = useSetItem(postsCollectionName, filtersCollections)
  const watchPostFiltering = useWatchPostFiltering(postsCollectionName, filtersCollections, fetchCollection)

  return {
    postsCollectionName,
    collections,
    postsCollection,
    filtersCollections,
    relationsCollections,
    rootNodes,
    checkedItems,
    directusFilters,
    setPostCollection,
    fetchCollection,
    setItem,
    watchPostFiltering,
  }
}
