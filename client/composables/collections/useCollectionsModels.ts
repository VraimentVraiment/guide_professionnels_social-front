export const useCollectionsModels = (
  postCollectionModel: Ref<CollectionModel | null>,
  filtersCollections: Ref<FiltersCollection[]>,
): ComputedRef<(CollectionModel | null)[]> => {
  const collectionsModelStore = useCollectionsModel()

  const collectionsModels = computed(() => {
    const filtersCollectionsModels = filtersCollections.value
      .map(({ collectionName }) => {
        return collectionsModelStore.getCollectionByName(collectionName)
      })

    return [
      postCollectionModel.value,
      ...filtersCollectionsModels,
    ]
  })

  return collectionsModels
}
