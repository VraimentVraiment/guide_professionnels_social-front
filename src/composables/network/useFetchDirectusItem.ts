import { type DirectusQueryParams } from 'nuxt-directus/dist/runtime/types'

export type FetchDirectusItemsParams = {
  collectionName: string
  params?: DirectusQueryParams
}

export type FetchDirectusItemParams = {
  collectionName: string
  id: number
}

/**
 * Fetches a single item from Directus, given a collection name and an id.
 */
export async function useFetchDirectusItem<T>({
  collectionName,
  id,
}: FetchDirectusItemParams): Promise<T | null> {
  const { getItemById } = useDirectusItems()

  try {
    const item = await getItemById<T>({
      collection: collectionName,
      id: id.toString(),
    })

    return item ?? null
  } catch (e) {
    console.error(e)
    return null
  }
}
