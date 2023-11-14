export function usePostsPagination<PostType extends GpsPost>(
  postsCollectionName: Ref<string | null>,
  postsCollection: Ref<PostsCollection<PostType> | null>,
  fetchCollection: (collectionName: string, { page }: { page: number }) => Promise<void>,
) {
  const currentPage = ref(0)

  const {
    getCollectionModelByName,
  } = useModelsStore()
  const totalPages = computed(() => {
    if (!postsCollection.value?.itemsCount) {
      return 1
    }
    const limit = getCollectionModelByName(postsCollectionName.value as string)?.limit ?? 100

    return Math.ceil(postsCollection.value?.itemsCount / limit)
  })

  const updatePagination = async(
    pageIndex: number,
  ) => {
    if (!postsCollectionName.value) {
      return
    }

    currentPage.value = pageIndex

    await fetchCollection(postsCollectionName.value, {
      page: currentPage.value + 1,
    })
  }

  return {
    pagination: {
      totalPages,
      currentPage,
    },
    updatePagination,
  }
}
