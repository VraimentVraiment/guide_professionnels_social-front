export const useDefinePostStore = () => {
  const postsCollectionModel = ref<CollectionModel | null>(null)
  const postsCollection = ref<Post[]>([])
  const relationsCollections = ref<RelationsCollection[]>([])
  const filtersCollections = ref<FiltersCollection[]>([])
  // const collections = ref<(FiltersCollection | {
  //   collectionName: string,
  //   items: Post[],
  // })[]>([])

  const collectionsModels = useCollectionsModels(postsCollectionModel, filtersCollections)
  const rootNodes = useRootNodes(filtersCollections, postsCollectionModel as Ref<CollectionModel>)
  const directusFilters = useDirectusFilters(collectionsModels, relationsCollections, filtersCollections)

  const setCollection = useSetCollection(postsCollectionModel)
  const setItem = useSetItem(filtersCollections, postsCollectionModel as Ref<CollectionModel>)
  const resetFilters = useResetFilters(filtersCollections)

  const fetchPostsCollection = useFetchPostsCollection(postsCollection, postsCollectionModel, directusFilters)
  const fetchFiltersCollection = useFetchFiltersCollection(filtersCollections, postsCollectionModel, directusFilters)
  const fetchRelationsCollection = useFetchRelationsCollection(relationsCollections, collectionsModels)

  const watchPostFiltering = useWatchPostFiltering(filtersCollections, fetchFiltersCollection, fetchPostsCollection)

  return {
    postsCollectionModel,
    postsCollection,
    filtersCollections,
    relationsCollections,
    rootNodes,
    directusFilters,
    setCollection,
    fetchPostsCollection,
    fetchFiltersCollection,
    fetchRelationsCollection,
    resetFilters,
    setItem,
    watchPostFiltering,
  }
}
