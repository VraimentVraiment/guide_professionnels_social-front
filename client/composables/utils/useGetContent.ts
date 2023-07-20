export async function useGetContent (
  path: string,
): Promise<RecursiveYmlContent> {
  return (await queryContent(path).findOne()) as RecursiveYmlContent
}
