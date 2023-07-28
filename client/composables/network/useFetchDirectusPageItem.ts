type PageItemQueryParams = {
  pageName: string
  status: PageStatus[]
  fields?: string[]
}

/**
 * Fetches a single page item from Directus.
 * NB: "Pages" is not a native collection in Directus, but a custom one created for GPS ('gps_pages').
 */
export async function useFetchDirectusPageItem({
  pageName,
  status = ['published-public', 'published-private'],
  fields = ['*'],
}: PageItemQueryParams): Promise<GpsPage | null> {
  const pages = await useFetchDirectusItems<GpsPage>({
    collectionName: 'gps_pages',
    params: {
      filter: {
        slug: pageName,
        status: {
          _in: status,
        },
      },
      fields,
    },
  })

  return pages?.[0] ?? null
}
