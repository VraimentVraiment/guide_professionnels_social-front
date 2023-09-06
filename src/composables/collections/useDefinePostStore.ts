/**
 * A composable that will be used in pinia to define the store for a certain post type.
 */
export const useDefinePostStore = <PostType extends GpsPost>() => {
  const {
    postsCollectionName,
    postsCollection,
    collections,
    filtersCollections,
    relationsCollections,
    setPostCollection,
  } = useCollections<PostType>()

  const rootNodes = useRootNodes(postsCollectionName, filtersCollections)
  const checkedItems = useGetCheckedItems(filtersCollections)
  const relationGroups = useRelationGroups(relationsCollections)
  const directusFilters = useDirectusFilters(postsCollectionName, filtersCollections, checkedItems, relationsCollections, relationGroups)
  const localisedPostItems = useLocalisedPostItems<PostType>(postsCollection)

  const fetchCollection = useFetchCollection<PostType>(postsCollectionName, collections, directusFilters)
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
    relationGroups,
    localisedPostItems,
    setPostCollection,
    fetchCollection,
    setItem,
    watchPostFiltering,
  }
}
