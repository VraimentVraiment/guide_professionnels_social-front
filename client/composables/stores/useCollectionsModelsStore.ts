/**
 * Defines a pinia store for managing our app collections' models,
 * which are abstractions of the entities in the database.
 */

export const useCollectionsModelsStore = defineStore('collectionsModels', useDefineCollectionsModelsStore, {
  // persist: true,
})

function useDefineCollectionsModelsStore () {
  const collectionsModels = ref<CollectionModel[]>([])

  const fetch = async () => {
    const {
      collections,
    } = (await useGetContent('/collections')) as {
      collections: CollectionModel[]
    }
    collectionsModels.value = collections
  }

  const getCollectionModelByName = (
    collectionName: string | null,
  ): CollectionModel | null => {
    if (!collectionName) {
      return null
    }

    return collectionsModels.value
      ?.find((collectionModel) => {
        return collectionModel.collectionName === collectionName
      }) ?? null
  }

  const getRelationsModels = (
    collectionName: string | null,
  ): CollectionRelationModel[] | null => {
    return getCollectionModelByName(collectionName)
      ?.relations ?? null
  }

  const getRelationModel = (
    collectionName: string | null,
    relationCollectionName: string,
  ): CollectionRelationModel | null => {
    return getRelationsModels(collectionName)
      ?.find((relationModel) => {
        return relationModel.targetCollectionName === relationCollectionName
      }) ?? null
  }

  const getManyToManyRelationsModels = (
    collectionName: string,
  ): CollectionRelationModel[] | null => {
    return getRelationsModels(collectionName)
      ?.filter((relationModel) => {
        return relationModel.relationType === 'many-to-many'
      }) ?? null
  }

  const getDependentCollectionsModels = (
    collectionName: string,
    type?: CollectionType,
  ): CollectionModel[] | null => {
    return collectionsModels.value
      ?.filter((collectionModel) => {
        const isType = (
          !type ||
          collectionModel.type === type
        )

        const hasRelation = collectionModel.relations
          ?.some((relationModel) => {
            return relationModel.targetCollectionName === collectionName
          }) ?? false

        return (
          isType &&
          hasRelation
        )
      }) ?? null
  }

  const getFields = (
    collectionName: string,
  ): string[] | null => {
    return getCollectionModelByName(collectionName)
      ?.fields ?? null
  }

  const getCollectionFilesModel = (
    collectionName: string,
  ): {
    filesCollectionName: string | null,
    filesField: string | null,
  } => {
    const collectionModel = getCollectionModelByName(collectionName)

    return {
      filesCollectionName: collectionModel?.filesCollectionName ?? null,
      filesField: collectionModel?.filesField ?? null,
    }
  }

  return {
    collectionsModels,
    getCollectionFilesModel,
    fetch,
    getRelationModel,
    getRelationsModels,
    getCollectionModelByName,
    getManyToManyRelationsModels,
    getDependentCollectionsModels,
    getFields,
  }
}
