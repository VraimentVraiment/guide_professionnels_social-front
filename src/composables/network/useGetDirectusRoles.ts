/**
 * Constructs a directus file link from a file id, using an auth token.
 */
export const useGetDirectusRoles = async(): Promise<unknown[]> => {
  const directusUrl = useRuntimeConfig().public.directus.url
  const { token } = useDirectusToken()

  const url = `${directusUrl}/roles?access_token=${token.value}`

  const { data } = await useFetch(url)

  return data
}
