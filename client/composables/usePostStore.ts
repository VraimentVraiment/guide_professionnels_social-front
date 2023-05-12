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
    filter: any,
  ): Promise<void> => {

    console.log("filter :", filter);

    const newDispositifs = await useFetchDirectusItems<PostType>({
      collectionName,
      params: {
        filter,
      },
    })

    if (newDispositifs) {
      console.log("-----------------------------------------");
      console.log("UPDATE POSTS :", newDispositifs);
      collection.value = newDispositifs
    }
  }

  return {
    collection,
    update,
  }
}
