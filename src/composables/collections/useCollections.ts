/**
 * Collections composable to manage the collections of the app,
 * based on their type (posts, filters, relations)
 */
export const useCollections = <PostType extends GpsPost>() => {
  const postsCollectionName = ref<string | null>(null)

  const setPostCollection = (
    collectionName: string,
  ): void => {
    postsCollectionName.value = collectionName
  }

  const collections = ref<ItemsCollection[]>([])

  const postsCollection = computed(() => {
    return collections.value
      .find((c) => {
        return c.collectionName === postsCollectionName.value
      }) as PostsCollection<PostType>
  })

  const { getRelationOrder } = useModelsStore()
  const filtersCollections = computed(() => {
    return (
      collections.value
        .filter((c) => {
          return c.type === 'taxonomy'
        }) as FiltersCollection[])
      ?.sort((a, b) => {
        return (
          getRelationOrder(postsCollectionName.value, a.collectionName) -
          getRelationOrder(postsCollectionName.value, b.collectionName)
        )
      })
  })

  const relationsCollections = computed(() => {
    return collections.value
      .filter((c) => {
        return c.type === 'relations'
      }) as RelationsCollection[]
  })

  return {
    postsCollectionName,
    postsCollection,
    collections,
    filtersCollections,
    relationsCollections,
    setPostCollection,
  }
}
