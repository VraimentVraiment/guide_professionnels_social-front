export async function useGetContent (
  path: string,
): Promise<RecursiveYmlContent> {
  return (await queryContent(path).findOne()) as RecursiveYmlContent
}

export async function useGetPageContent (
  pageKey: string,
): Promise<{
  metaTitle: string
  title: string
  metaDescription?: string
}> {
  const content = await queryContent('/pages').findOne()

  return content?.[pageKey]
}
