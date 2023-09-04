export async function useFetchNuxtPageContent(
  routeName: string,
): Promise<GpsPage | null> {
  const pagesMeta = await queryContent('/meta').findOne()

  return pagesMeta?.[routeName] ?? null
}
