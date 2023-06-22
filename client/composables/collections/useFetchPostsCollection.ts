export const useFetchPostsCollection = (
  postsCollection: Ref<Post[]>,
  postCollectionModel: Ref<CollectionModel | null>,
  directusFilters: ComputedRef<CollectionDirectusFilter[]>,
): (() => Promise<void>) => {
  return async (): Promise<void> => {
    postsCollection.value = await useFetchCollectionItems<Post>(
      postCollectionModel.value?.collectionName as string,
      directusFilters,
      postCollectionModel.value?.thumbnailFields,
    )
  }
}
