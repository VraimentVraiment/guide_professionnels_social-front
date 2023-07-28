/**
 * Fetches a collection's items from Directus, given a collection name and optional params.
 */
export async function useFetchDirectusItems<T>({
  collectionName,
  params,
}: FetchDirectusItemsParams): Promise<T[]> {
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
