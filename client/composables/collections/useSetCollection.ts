export function useSetCollection(
  collectionModel: Ref<CollectionModel | null>,
) {
  const setCollection = async (collectionName: string) => {

    const {
      collections: collectionsModel,
    } = (await useGetContent('/collections')) as {
      collections: CollectionModel[]
    }

    collectionModel.value = collectionsModel
      .find((collection) => {
        return collection.collectionName === collectionName
      }) ?? null

    // nextTick(async () => {
    //   await fetchFilterCollections()
    //   await fetchRelationsCollections()
    // })
  }

  return setCollection
}