export async function useFetchDirectusItems<T>({
  collectionName,
  filter,
}: {
  collectionName: string
  filter?: DirectusFilter
}): Promise<T[]> {
  const { getItems } = useDirectusItems()

  try {
    return (await getItems<T>({
      collection: collectionName,
      params: { filter },
    })) as T[]

  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
    return []
  }
}

export async function useFetchDirectusItem<T>({
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
