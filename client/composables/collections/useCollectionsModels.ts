export const useCollectionsModels = (
  postsCollectionModel: Ref<CollectionModel | null>,
  filtersCollections: Ref<FiltersCollection[]>,
): ComputedRef<(CollectionModel | null)[]> => {
  const collectionsModelsStore = useCollectionsModelsStore()

  const collectionsModels = computed(() => {
    const filtersCollectionsModels = filtersCollections.value
      .map(({ collectionName }) => {
        return collectionsModelsStore.getCollectionByName(collectionName)
      })

    return [
      postsCollectionModel.value,
      ...filtersCollectionsModels,
    ]
  })

  return collectionsModels
}
