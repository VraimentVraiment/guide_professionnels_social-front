export function useFetchRelationsCollections(
  relationsCollections: Ref<DirectusFilter[]>,
  collectionModel: Ref<CollectionModel | null>,
) {
  async function fetchRelationsCollections(): Promise<void> {
    relationsCollections.value = await Promise.all(
      getRelationsCollections(collectionModel.value),
    )
  }
  return fetchRelationsCollections;
}

function getRelationsCollections(
  collectionModel: CollectionModel | null,
): Promise<any>[] {
  const relations = collectionModel?.relations
    ?.filter((relationModel) => {
      return relationModel.relationType === 'many-to-many'
    })
    ?.map(fetchRelationCollection)

  return relations ?? [];
}

async function fetchRelationCollection(
  relationModel: CollectionRelationModel,
) {
  const items = await useFetchDirectusItems<DirectusFilterItem>({
    collectionName: relationModel.junctionCollectionName as string,
    params: { limit: -1 },
  })
  return {
    ...relationModel,
    items,
  }
}
