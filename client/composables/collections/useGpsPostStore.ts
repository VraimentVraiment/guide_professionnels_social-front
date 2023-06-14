export const useGpsPostStore = () => {

  const collectionModel = ref<CollectionModel | null>(null)
  const postsCollection = ref<Post[]>([])
  const relationsCollections = ref<DirectusFilter[]>([])
  const filtersCollections = ref<FiltersCollection[]>([])

  const checkedItems = useCheckedItems(filtersCollections);
  const rootNodes = useRootNodes(filtersCollections, collectionModel as Ref<CollectionModel>);
  const directusFilter = useDirectusFilter(collectionModel, checkedItems, relationsCollections, filtersCollections);
  const resetFilters = useResetFilters(filtersCollections);
  const setItem = useSetItem(collectionModel, filtersCollections);
  const setCollection = useSetCollection(collectionModel);

  const fetchPostsCollection = useFetchPostsCollection(postsCollection, directusFilter, collectionModel);
  const fetchFilterCollections = useFetchFiltersCollections(filtersCollections, collectionModel);
  const fetchRelationsCollections = useFetchRelationsCollections(relationsCollections, collectionModel);

  return {
    collectionModel,
    setCollection,
    postsCollection,
    filtersCollections,
    fetchFilterCollections,
    fetchRelationsCollections,
    relationsCollections,
    rootNodes,
    checkedItems,
    directusFilter,
    fetchPostsCollection,
    resetFilters,
    setItem,
  }
}

