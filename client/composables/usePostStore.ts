/**
 * @description Composable function to manage posts.
 */

export function usePostStore <PostType extends Post> ({
  collectionName,
}: {
  collectionName: string
}): PostStore<PostType> {
  const collection = ref([]) as Ref<PostType[]>

  const update = async (
    filters?: FiltersCollection[],
  ): Promise<void> => {
    const directusFilter = getDirectusFilter(filters)

    const newDispositifs = await useFetchDirectusItems<PostType>({
      collectionName,
      filter: directusFilter,
    })

    if (!newDispositifs) { return }

    collection.value = newDispositifs
  }

  return {
    collection,
    update,
  }
}
