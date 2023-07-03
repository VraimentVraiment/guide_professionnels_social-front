import {
  group,
} from 'd3-array'

export const useDefinePostStore = () => {
  const searchStore = useSearchStore()

  const {
    postsCollectionName,
    postsCollection,
    collections,
    filtersCollections,
    relationsCollections,
    setPostCollection,
  } = useCollections()

  const relationGroups = computed(() => {
    return relationsCollections.value
      .filter((relationsCollection) => {
        return relationsCollection.relationModel.relationType === 'many-to-many'
      })
      .map((relationsCollection) => {
        const {
          targetKey,
          sourceKey,
        } = relationsCollection.relationModel as {
          targetKey: string
          sourceKey: string
        }

        // Group relations if they are related to the same source item
        const relationsGroups = group(
          relationsCollection.items,
          item => item[sourceKey],
        )

        // Convert the relationsGroups InternMap to an array of objects
        return {
          targetKey,
          sourceKey,
          groups: Array
            .from(relationsGroups, ([sourceId, relationGroup]) => {
              return {
                [sourceKey]: sourceId,
                [targetKey]: relationGroup.map(relationItem => relationItem[targetKey]),
              }
            }),
        }
      })
  })

  const rootNodes = useRootNodes(postsCollectionName, filtersCollections)
  const checkedItems = useGetCheckedItems(filtersCollections)
  const directusFilters = useDirectusFilters(postsCollectionName, filtersCollections, checkedItems, relationsCollections, relationGroups)
  // const directusFilters = useDirectusFilters(postsCollectionName, filtersCollections, checkedItems, relationsCollections, relationGroups)

  const fetchCollection = useFetchCollection(postsCollectionName, collections, directusFilters)
  const setItem = useSetItem(postsCollectionName, filtersCollections)
  const watchPostFiltering = useWatchPostFiltering(postsCollectionName, filtersCollections, fetchCollection)

  const postItems = computed(() => {
    const items = postsCollection?.value?.items || []

    if (!searchStore.selectedCityList?.length) {
      return items
    }

    return items
      ?.filter((post) => {
        return addressMatch(post.addresses, searchStore.selectedCityList)
      })
  })

  return {
    postsCollectionName,
    collections,
    postsCollection,
    filtersCollections,
    relationsCollections,
    rootNodes,
    checkedItems,
    directusFilters,
    relationGroups,
    postItems,
    setPostCollection,
    fetchCollection,
    setItem,
    watchPostFiltering,
  }
}
