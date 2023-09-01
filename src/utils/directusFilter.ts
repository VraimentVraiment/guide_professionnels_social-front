export const getDirectusFilter = (
  directusFilters: CollectionDirectusFilter[] | ComputedRef<CollectionDirectusFilter[]>,
  collectionName: string,
): DirectusFilter => {
  const directusFilter = unref(directusFilters)
    ?.find((filter) => {
      return filter.collectionName === collectionName
    })
    ?.filter ?? {}

  return directusFilter
}
