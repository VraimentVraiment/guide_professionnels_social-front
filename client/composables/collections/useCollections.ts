/**
 * Collections composable to manage the collections of the app,
 * based on their type (posts, filters, relations)
 */
export const useCollections = () => {
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
      }) as PostsCollection
  })

  const filtersCollections = computed(() => {
    return collections.value
      .filter((c) => {
        return c.type === 'taxonomy'
      }) as FiltersCollection[]
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
