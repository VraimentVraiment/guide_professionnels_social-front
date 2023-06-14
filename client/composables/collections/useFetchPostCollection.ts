export function useFetchPostsCollection(
  postsCollection: Ref<Post[]>,
  directusFilter: ComputedRef<DirectusFilter>,
  collectionModel: Ref<CollectionModel | null>,
) {
  async function fetchPostsCollection() {
    const posts = await getPosts(directusFilter.value, collectionModel.value);
    postsCollection.value = posts;
  }
  return fetchPostsCollection;
}

async function getPosts(
  directusFilter: DirectusFilter,
  collectionModel: CollectionModel | null,
): Promise<Post[]> {
  if (!collectionModel) { return [] }
  const posts = await useFetchDirectusItems<Post>({
    collectionName: collectionModel?.collectionName,
    params: {
      fields: collectionModel?.thumbnailFields ?? ['*'], // TODO: Not sure about brackets
      filter: directusFilter,
    },
  })

  return posts ?? [];
}
