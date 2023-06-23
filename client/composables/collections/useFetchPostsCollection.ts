export const useFetchPostsCollection = (
  postsCollection: Ref<Post[]>,
  postsCollectionModel: Ref<CollectionModel | null>,
  directusFilters: ComputedRef<CollectionDirectusFilter[]>,
): (() => Promise<void>) => {
  return async (): Promise<void> => {
    const items = await useFetchCollectionItems<Post>(
      postsCollectionModel.value?.collectionName as string,
      directusFilters,
      postsCollectionModel.value?.thumbnailFields,
    )

    postsCollection.value = items
  }
}
