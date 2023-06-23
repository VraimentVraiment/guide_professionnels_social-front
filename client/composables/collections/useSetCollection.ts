export function useSetCollection (
  collectionModel: Ref<CollectionModel | null>,
) {
  const setCollection = (
    collectionName: string,
  ): void => {
    const collectionsModelsStore = useCollectionsModelsStore()
    collectionModel.value = collectionsModelsStore.getCollectionByName(collectionName)
  }

  return setCollection
}
