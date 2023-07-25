export function useGetContent (
  path: string,
): Promise<RecursiveYmlContent> {
  return queryContent(path).findOne() as Promise<RecursiveYmlContent>
}
