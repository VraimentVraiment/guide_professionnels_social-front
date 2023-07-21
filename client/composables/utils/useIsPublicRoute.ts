export async function useIsPublicRoute (slug: string) {
  if ([
    '/login',
    '/404',
  ].includes(slug)) {
    return true
  }

  const publicPageExists = (
    await useFetchDirectusItems<unknown>({
      collectionName: 'gps_pages',
      params: {
        filter: {
          status: {
            _in: ['published-public'],
          },
          slug,
        },
        fields: ['id'],
      },
    })
  )?.length > 0

  return publicPageExists
}
