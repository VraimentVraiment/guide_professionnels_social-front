export function useRootNodes (
  filtersCollections: Ref<FiltersCollection[]>,
  postsCollectionModel: Ref<CollectionModel>,
) {
  const rootNodes = computed(() => {
    return filtersCollections.value
      .map((collection) => {
        const relationModel = getRelationModel(postsCollectionModel.value, collection.collectionName)
        if (!relationModel) {
          return null
        }

        return stratifyFilters(relationModel, collection.items)
      })
  })

  return rootNodes
}
