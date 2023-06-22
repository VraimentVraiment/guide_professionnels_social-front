export const usePostStore = () => {
  const postCollectionModel = ref<CollectionModel | null>(null)
  const postsCollection = ref<Post[]>([])
  const relationsCollections = ref<RelationsCollection[]>([])
  const filtersCollections = ref<FiltersCollection[]>([])
  const cancelWatch = ref(false)

  const collectionsModels = useCollectionsModels(postCollectionModel, filtersCollections)
  const checkedItems = useCheckedItems(filtersCollections)
  const rootNodes = useRootNodes(filtersCollections, postCollectionModel as Ref<CollectionModel>)
  const directusFilters = useDirectusFilters(collectionsModels, checkedItems, relationsCollections, filtersCollections)

  const setCollection = useSetCollection(postCollectionModel)
  const setItem = useSetItem(filtersCollections, postCollectionModel as Ref<CollectionModel>)
  const resetFilters = useResetFilters(filtersCollections)

  const fetchPostsCollection = useFetchPostsCollection(postsCollection, postCollectionModel, directusFilters)
  const fetchFiltersCollections = useFetchFiltersCollections(filtersCollections, postCollectionModel, directusFilters, cancelWatch)
  const fetchRelationsCollections = useFetchRelationsCollections(relationsCollections, collectionsModels)

  return {
    postCollectionModel,
    postsCollection,
    filtersCollections,
    relationsCollections,
    rootNodes,
    checkedItems,
    cancelWatch,
    directusFilters,
    setCollection,
    fetchFiltersCollections,
    fetchRelationsCollections,
    fetchPostsCollection,
    resetFilters,
    setItem,
  }
}
