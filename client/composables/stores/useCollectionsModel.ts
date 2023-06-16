export const useCollectionsModel = defineStore('collectionsModel', () => {

  const collections = ref<CollectionModel[]>()

  const fetch = async () => {
    const {
      collections: c,
    } = (await useGetContent('/collections')) as {
      collections: CollectionModel[]
    }
    collections.value = c
  }

  const getCollectionByName = (
    collectionName: string,
  ): CollectionModel | null => {
    return collections.value
      ?.find((collectionModel) => {
        return collectionModel.collectionName === collectionName
      }) ?? null
  }

  const getDependentCollections = (
    collectionName: string,
  ): CollectionModel[] | null => {
    return collections.value
      ?.filter((collectionModel) => {
        return collectionModel.relations
          ?.some((relationModel) => {
            return relationModel.collectionName = collectionName
          })
      }) ?? null
  }

  return {
    collections,
    fetch,
    getCollectionByName,
    getDependentCollections,
  }
})