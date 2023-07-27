export async function useIsPublicRoute (pageName: string) {
  if ([
    'login',
    '404',
  ].includes(pageName)) {
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
          slug: `/${pageName}`,
        },
        fields: ['id'],
      },
    })
  )?.length > 0

  return publicPageExists
}
