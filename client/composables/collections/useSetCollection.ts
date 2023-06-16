export function useSetCollection(
  collectionModel: Ref<CollectionModel | null>,
) {
  const setCollection = (
    collectionName: string,
  ): void => {

    const collectionsModelStore = useCollectionsModel()

    collectionModel.value = collectionsModelStore.getCollectionByName(collectionName)
  }

  return setCollection
}