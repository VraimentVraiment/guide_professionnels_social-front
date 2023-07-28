/**
 * Constructs a directus file link from a file id, using an auth token.
 */
export const useGetDirectusFileLink = (
  fileId: string | null | undefined,
  {
    download = false,
  } = {},
): string => {
  if (!fileId) {
    return ''
  }
  const directusUrl = useRuntimeConfig().public.directus.url
  const { token } = useDirectusToken()

  return `${directusUrl}/assets/${fileId}?access_token=${token.value}${download ? '&download=true' : ''}`
}
