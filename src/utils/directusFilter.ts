export const getDirectusFilter = (
  directusFilters: CollectionDirectusFilter[] | ComputedRef<CollectionDirectusFilter[]>,
  collectionName: string,
): CollectionDirectusFilter['filter'] | false => {
  const directusFilter = unref(directusFilters)
    ?.find((filter) => {
      return filter.collectionName === collectionName
    })
    ?.filter ?? {}

  return isEmptyFilter(directusFilter)
    ? false
    : directusFilter
}

/**
 * @todo more conditions to check if the filter is empty
 */
export const isEmptyFilter = (
  directusFilter: CollectionDirectusFilter['filter'],
): boolean => {
  return directusFilter
    ?._and
    ?.some((f: Record<string, any>) => {
      return f
        ?.id
        ?._in
        ?.length === 0
    })
}
