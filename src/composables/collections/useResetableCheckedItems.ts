export function useResetableCheckedItems(
  postsCollectionName: Ref<string | null>,
  checkedItems: Ref<FiltersCollection[]>,
) {
  const { getRelationModel } = useCollectionsModels()

  const resetableCheckedItems = computed(() => {
    return checkedItems.value
      .filter((collection) => {
        const relationModel = getRelationModel(
          postsCollectionName.value as string,
          collection.collectionName,
        )

        return !relationModel?.mandatory
      })
  })

  return resetableCheckedItems
}
