export function useRootNodes(
  filtersCollections: Ref<FiltersCollection[]>,
  collectionModel: Ref<CollectionModel>,
) {
  const rootNodes = computed(() => {
    return filtersCollections.value
      .map((collection) => {
        return stratifyFilters(collection, collectionModel.value)
      })
  })
  return rootNodes;
}