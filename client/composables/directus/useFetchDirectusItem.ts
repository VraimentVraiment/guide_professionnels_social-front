/**
 * Fetches a single item from Directus, given a collection name and an id.
 */
export async function useFetchDirectusItem<T> ({
  collectionName,
  id,
}: FetchDirectusItemParams): Promise<T | null> {
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
