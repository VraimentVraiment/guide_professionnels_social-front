export const useCollectionsModelsStore = defineStore('collectionsModels', () => {
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
    type?: CollectionType,
  ): CollectionModel[] | null => {
    return collections.value
      ?.filter((collectionModel) => {
        const isType = (
          !type ||
          collectionModel.type === type
        )
        const hasRelation = collectionModel.relations
          ?.some((relationModel) => {
            return relationModel.collectionName === collectionName
          }) ?? false
        return (
          isType &&
          hasRelation
        )
      }) ?? null
  }

  return {
    collections,
    fetch,
    getCollectionByName,
    getDependentCollections,
  }
}, {
  // persist: true,
})
