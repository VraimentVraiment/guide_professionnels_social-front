export const getDirectusFile = (
  fileId: string,
): string => {
  const directusUrl = useRuntimeConfig().public.directus.url
  return `${directusUrl}/assets/${fileId}`
}
