export function useFetchPostsCollection(
  postsCollection: Ref<Post[]>,
  postCollectionModel: Ref<CollectionModel | null>,
  directusFilters: ComputedRef<DirectusFilter[]>,
) {

  async function fetchPostsCollection() {
    const directusFilter = directusFilters.value
    ?.find((filter) => {
      return filter.collectionName === postCollectionModel.value?.collectionName
    })?.filter ?? {} as Record<string, unknown>

    const posts = await getPosts(postCollectionModel.value, directusFilter);
    postsCollection.value = posts;
  } 
  return fetchPostsCollection;
}

async function getPosts(
  postCollectionModel: CollectionModel | null,
  directusFilter: unknown,
): Promise<Post[]> {
  if (!postCollectionModel) { return [] }
  const posts = await useFetchDirectusItems<Post>({
    collectionName: postCollectionModel?.collectionName,
    params: {
      fields: postCollectionModel?.thumbnailFields ?? ['*'], // TODO: Not sure about brackets
      filter: directusFilter,
    },
  })

  return posts ?? [];
}
