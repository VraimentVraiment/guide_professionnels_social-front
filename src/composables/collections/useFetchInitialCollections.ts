export function useFetchInitialCollections(
  postsCollectionName: Ref<string | null>,
  filtersCollections: Ref<FiltersCollection[]>,
  fetchCollection: (collectionName: string) => void,
) {
  const fetchInitialCollections = () => {
    const { getCollectionModelByName } = useCollectionsModels()
    const collectionModel = getCollectionModelByName(postsCollectionName.value as string)

    const relationsCollectionsNames = collectionModel?.relations
      ?.filter((relationModel) => {
        return !filtersCollections.value
          .some(({ collectionName }) => {
            return collectionName === relationModel.targetCollectionName
          },
          )
      })
      ?.map((relationModel) => {
        return relationModel?.targetCollectionName
      }) ?? []

    const promises = [postsCollectionName.value as string, ...relationsCollectionsNames]
      ?.map((collectionName) => {
        return fetchCollection(collectionName)
      })

    return Promise
      .allSettled(promises)
  }

  return fetchInitialCollections
}
