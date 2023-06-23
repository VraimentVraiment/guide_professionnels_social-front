export function useFetchRelationsCollection (
  relationsCollections: Ref<RelationsCollection[]>,
  collectionsModels: ComputedRef<(CollectionModel | null)[]>,
) {
  function fetchRelationsCollection (
    collectionName: string,
  ): Promise<void[]> | null {
    const collectionModel = collectionsModels.value
      .find((collectionModel) => {
        return collectionModel?.collectionName === collectionName
      })

    const relationsModels = collectionModel
      ?.relations
      ?.filter((relationModel) => {
        return relationModel.relationType === 'many-to-many'
      })

    if (!relationsModels?.length) {
      return null
    }

    return Promise.all(
      relationsModels
        .map((relationModel) => {
          return fetchRelationCollection(relationModel, relationsCollections, collectionName)
        }),
    )
  }

  return fetchRelationsCollection
}

async function fetchRelationCollection (
  relationModel: CollectionRelationModel,
  relationsCollections: Ref<RelationsCollection[]>,
  collectionName: string,
) {
  const items = await useFetchDirectusItems<DirectusRelationItem>({
    collectionName: relationModel.relationCollectionName as string,
    params: { limit: -1 },
  })

  const existingCollection = relationsCollections.value
    .find((relationsCollection) => {
      return (
        relationsCollection.targetCollectionName === relationModel.collectionName &&
      relationsCollection.sourceCollectionName === collectionName
      )
    })

  if (existingCollection) {
    existingCollection.items = items
  } else {
    relationsCollections.value.push({
      relationModel,
      targetCollectionName: relationModel.collectionName,
      sourceCollectionName: collectionName,
      items,
    })
  }
}
