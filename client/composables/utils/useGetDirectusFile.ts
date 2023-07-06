export const getDirectusFileLink = (
  fileId: string | null | undefined,
): string => {
  if (!fileId) {
    return ''
  }
  const directusUrl = useRuntimeConfig().public.directus.url
  return `${directusUrl}/assets/${fileId}`
}
