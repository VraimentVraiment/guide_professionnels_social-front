export function useRootNodes(
  filtersCollections: Ref<FiltersCollection[]>,
  postCollectionModel: Ref<CollectionModel>,
) {
  const rootNodes = computed(() => {
    return filtersCollections.value
      .map((collection) => {
        const relationModel = postCollectionModel.value?.relations
          ?.find(relation => relation.collectionName === collection.collectionName)
        if (!relationModel) { return }
        return stratifyFilters(relationModel, collection.items)
      })
  })

  return rootNodes;
}