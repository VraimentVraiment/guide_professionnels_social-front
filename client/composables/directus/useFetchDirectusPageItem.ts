/**
 * Fetches a single page item from Directus.
 * NB: "Pages" is not a native collection in Directus, but a custom one created for GPS ('gps_pages').
 */
export async function useFetchDirectusPageItem (
  pageName: string,
  status: PageStatus[],
  fields = ['*'],
) {
  const pages = await useFetchDirectusItems<unknown>({
    collectionName: 'gps_pages',
    params: {
      filter: {
        status: {
          _in: status,
        },
        slug: pageName,
      },
      fields,
    },
  })

  return pages
}
