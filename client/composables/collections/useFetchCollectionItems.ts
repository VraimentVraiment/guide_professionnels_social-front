export async function useFetchCollectionItems<T> (
  collectionName: string,
  directusFilters: ComputedRef<CollectionDirectusFilter[]>,
  fields: string[] = ['*'], // TODO: Not sure about brackets
): Promise<T[]> {
  const directusFilter = getDirectusFilter(directusFilters, collectionName)

  const items = await useFetchDirectusItems<T>({
    collectionName,
    params: {
      filter: directusFilter,
      fields,
    },
  })

  return items ?? []
}
