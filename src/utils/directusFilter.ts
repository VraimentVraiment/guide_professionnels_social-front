export const getDirectusFilter = (
  directusFilters: CollectionDirectusFilter[] | ComputedRef<CollectionDirectusFilter[]>,
  collectionName: string,
): DirectusFilter | false => {
  const directusFilter = unref(directusFilters)
    ?.find((filter) => {
      return filter.collectionName === collectionName
    })
    ?.filter ?? {}

  /**
   * @todo more conditions to check if the filter is empty
   */
  const emptyFilter = directusFilter
    ?._and
    ?.some((f) => {
      return f.id._in.length === 0
    })

  return emptyFilter ? false : directusFilter
}
