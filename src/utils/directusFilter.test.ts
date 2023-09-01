describe('getDirectusFilter', () => {
  it('returns an empty object when given an empty array of directusFilters', () => {
    const directusFilters: CollectionDirectusFilter[] = []
    const collectionName = 'posts'

    const result = getDirectusFilter(directusFilters, collectionName)

    expect(result).toEqual({})
  })

  it('returns an empty object when there are no matching directusFilters', () => {
    const directusFilters: CollectionDirectusFilter[] = [
      { collectionName: 'users', filter: { id: { _eq: 1 } } },
      { collectionName: 'comments', filter: { post_id: { _eq: 1 } } },
    ]
    const collectionName = 'posts'

    const result = getDirectusFilter(directusFilters, collectionName)

    expect(result).toEqual({})
  })

  it('returns the filter object when there is a matching directusFilter', () => {
    const directusFilters: CollectionDirectusFilter[] = [
      { collectionName: 'users', filter: { id: { _eq: 1 } } },
      { collectionName: 'posts', filter: { id: { _eq: 2 } } },
      { collectionName: 'comments', filter: { post_id: { _eq: 1 } } },
    ]
    const collectionName = 'posts'

    const result = getDirectusFilter(directusFilters, collectionName)

    expect(result).toEqual({ id: { _eq: 2 } })
  })
})
