/**
 * Constructs a directus file link from a file id, using an auth token.
 */
export const useGetDirectusFileLink = (
  fileId: string | null | undefined,
  {
    download = false,
    isPublic = false,
  } = {},
): string | null => {
  if (!fileId) {
    return null
  }
  const directusUrl = useRuntimeConfig().public.directus.url
  let url = `${directusUrl}/assets/${fileId}`
  const params = new URLSearchParams()

  if (!isPublic) {
    const { token } = useDirectusToken()
    if (token.value) {
      params.append('access_token', token.value)
    }
  }

  if (download) {
    params.append('download', 'true')
  }

  if ([...params].length) {
    url += `?${params.toString()}`
  }

  return url
}
