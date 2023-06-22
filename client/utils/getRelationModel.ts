export const getRelationModel = (
  collectionModel: CollectionModel,
  collectionName: string,
): CollectionRelationModel | null => {
  const relationModel = collectionModel
    ?.relations
    ?.find((relation) => {
      return relation.collectionName === collectionName
    })

  return relationModel ?? null
}
