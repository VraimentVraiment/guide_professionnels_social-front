import {
  type DirectusQueryParams,
} from 'nuxt-directus/dist/runtime/types'

/**
 * @description Composable function to manage posts.
 */
export const usePostStore = defineStore('posts', () => {

  const collection = ref<Post[]>([])

  const update = async ({
    collectionName,
    params,
  }: {
    collectionName: string
    params?: DirectusQueryParams
  }): Promise<void> => {

    const newDispositifs = await useFetchDirectusItems<Post>({
      collectionName,
      params,
    })

    if (newDispositifs) {
      collection.value = newDispositifs
    }
  }

  return {
    collection,
    update,
  }
})
