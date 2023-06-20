export function useFetchPostsCollection (
  postsCollection: Ref<Post[]>,
  postCollectionModel: Ref<CollectionModel>,
  directusFilters: ComputedRef<CollectionDirectusFilter[]>,
) {
  async function fetchPostsCollection () {
    const directusFilter = getDirectusFilter(directusFilters.value, postCollectionModel.value.collectionName)
    const posts = await getPosts(postCollectionModel.value, directusFilter)
    postsCollection.value = posts
  }
  return fetchPostsCollection
}

async function getPosts (
  postCollectionModel: CollectionModel | null,
  directusFilter: DirectusFilter,
): Promise<Post[]> {
  if (!postCollectionModel) { return [] }

  const posts = await useFetchDirectusItems<Post>({
    collectionName: postCollectionModel?.collectionName,
    params: {
      fields: postCollectionModel?.thumbnailFields ?? ['*'], // TODO: Not sure about brackets
      filter: directusFilter,
    },
  })

  return posts ?? []
}
