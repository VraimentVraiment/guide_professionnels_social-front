export async function useFetchNuxtPageContent(
  routeName: string,
): Promise<GpsPage | null> {
  const pages = await queryContent('/pages').findOne()

  return pages?.[routeName] ?? null
}
