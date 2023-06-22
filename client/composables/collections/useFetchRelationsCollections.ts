export function useFetchRelationsCollections (
  relationsCollections: Ref<RelationsCollection[]>,
  collectionsModels: ComputedRef<(CollectionModel | null)[]>,
) {
  async function fetchRelationsCollections (): Promise<void> {
    relationsCollections.value = await Promise.all(
      collectionsModels.value
        .flatMap(getRelationsCollections),
    )
  }
  return fetchRelationsCollections
}

function getRelationsCollections (
  collectionModel: CollectionModel | null,
): Promise<RelationsCollection>[] {
  const relations = collectionModel?.relations
    ?.filter((relationModel) => {
      return relationModel.relationType === 'many-to-many'
    })
    ?.map((relationModel) => {
      return fetchRelationCollection(collectionModel.collectionName, relationModel)
    })

  return relations ?? []
}

async function fetchRelationCollection (
  sourceCollectionName: string,
  relationModel: CollectionRelationModel,
): Promise<RelationsCollection> {
  const items = await useFetchDirectusItems<DirectusItem>({
    collectionName: relationModel.junctionCollectionName as string,
    params: { limit: -1 },
  })

  return {
    ...relationModel,
    targetCollectionName: relationModel.collectionName,
    sourceCollectionName,
    items,
  }
}
