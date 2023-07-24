/**
 * For each filters collection, compute the hierarchy tree
 * of the filters items, based on their parent_id
 */
export function useRootNodes (
  postsCollectionName: Ref<string | null>,
  filtersCollections: Ref<FiltersCollection[]>,
) {
  const { getRelationModel } = useCollectionsModelsStore()

  const rootNodes = computed(() => {
    return filtersCollections.value
      .map((collection) => {
        const relationModel = getRelationModel(postsCollectionName.value, collection.collectionName)
        if (!relationModel) {
          return null
        }

        collection.items.forEach((item) => {
          item.parent_id ??= 0
        })

        return stratify<FilterItemNode>(
          collection.items,
          item => item.id?.toString() ?? null,
          item => item.parent_id?.toString() ?? null,
          () => getRootFilterItemNode(relationModel),
        )
      })
  })

  return rootNodes
}
