export const useFetchPostsCollection = (
  postsCollection: Ref<Post[]>,
  postCollectionModel: Ref<CollectionModel | null>,
  directusFilters: ComputedRef<CollectionDirectusFilter[]>,
): (() => Promise<void>) => {
  const isFetching = ref(false)

  return async (): Promise<void> => {
    if (isFetching.value) {
      return
    }

    isFetching.value = true

    const items = await useFetchCollectionItems<Post>(
      postCollectionModel.value?.collectionName as string,
      directusFilters,
      postCollectionModel.value?.thumbnailFields,
    )

    postsCollection.value = items

    isFetching.value = false
  }
}
