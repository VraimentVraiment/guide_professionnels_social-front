export const useModelsStore = defineStore('models', useDefineModelsStore, {
  persist: PERSISTANCE_CONFIG.MODELS_STORE,
})

function useDefineModelsStore() {
  const collectionsModels = ref<CollectionModel[] | null>(null)

  const load = async() => {
    collectionsModels.value = (
      await queryContent('collections-models').findOne()
    ).collections as unknown as CollectionModel[]
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

  const getRelationOrder = (
    collectionName: string | null,
    relationCollectionName: string,
  ): number => {
    return getRelationModel(collectionName, relationCollectionName)
      ?.order ?? 0
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
      ?.thumbnailFields ?? null
  }

  const getCollectionFilesModel = (
    collectionName: string,
    field: string,
  ): CollectionRelatedFilesModel | null => {
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
    load,
    getRelationModel,
    getRelationsModels,
    getRelationOrder,
    getCollectionModelByName,
    getManyToManyRelationsModels,
    getDependentCollectionsModels,
    getFields,
  }
}
