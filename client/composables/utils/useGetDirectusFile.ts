export const useGetDirectusFileLink = (
  fileId: string | null | undefined,
): string => {
  if (!fileId) {
    return ''
  }
  const directusUrl = useRuntimeConfig().public.directus.url
  const { token } = useDirectusToken()
  return `${directusUrl}/assets/${fileId}?access_token=${token.value}`
}
