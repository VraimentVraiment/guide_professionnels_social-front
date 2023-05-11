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
    // console.log("--------------- UPDATE POSTS ---------------");
    const directusFilter = getDirectusFilter(filters)
    // console.log('directusFilter', directusFilter);

    const newDispositifs = await useFetchDirectusItems<PostType>({
      collectionName,
      filter: directusFilter,
    })

    if (!newDispositifs) { return }

    // console.log("newDispositifs :", newDispositifs);
    collection.value = newDispositifs
  }

  return {
    collection,
    update,
  }
}
