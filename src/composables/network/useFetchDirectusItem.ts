/**
 * Fetches a single item from Directus, given a collection name and an id.
 */
export async function useFetchDirectusItem<T>({
  collectionName,
  id,
}: FetchDirectusItemParams): Promise<T | null> {
  const { getItemById } = useDirectusItems()

  const item = await getItemById<T>({
    collection: collectionName,
    id: id.toString(),
  })

  return item ?? null
}
