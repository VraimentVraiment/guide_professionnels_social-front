import {
  type DirectusQueryParams,
} from 'nuxt-directus/dist/runtime/types'

export async function useFetchDirectusItems<T> ({
  collectionName,
  params,
}: {
  collectionName: string
  params?: DirectusQueryParams
}): Promise<T[]> {
  const { getItems } = useDirectusItems()

  try {
    const items = await getItems<T>({
      collection: collectionName,
      params,
    })

    return items
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
    return []
  }
}

export async function useFetchDirectusItem<T> ({
  collectionName,
  id,
}: {
  collectionName: string
  id: number
},
): Promise<T | null> {
  const { getItemById } = useDirectusItems()

  try {
    return await getItemById<T>({
      collection: collectionName,
      id: id.toString(),
    })
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
    return null
  }
}
