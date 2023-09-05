/**
 * Defines a pinia store for managing our app collections' models,
 */
export const useCollectionsModelsStore = defineStore('collectionsModels', useDefineCollectionsModelsStore, {
  persist: PERSISTANCE_CONFIG.COLLECTIONS_MODELS,
})

function useDefineCollectionsModelsStore() {
  const collectionsModels = useRuntimeConfig().public.directusCollectionsSchema.collections

  const getCollectionModelByName = (
    collectionName: string | null,
  ): CollectionModel | null => {
    if (!collectionName) {
      return null
    }

    return collectionsModels
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
    return collectionsModels
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
    field: string,
  ): RelatedFilesModel | null => {
    const collectionModel = getCollectionModelByName(collectionName)

    const relatedFileModel = collectionModel
      ?.relatedFiles
      ?.find((m) => {
        return m.field === field
      })

    return relatedFileModel ?? null
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
