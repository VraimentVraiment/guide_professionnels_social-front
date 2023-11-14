/**
 * @todo find a way to get the admin roles ids from the directus api.
 * Right now we are hardcoding it.
 */

type DirectusRole = {
  users: string[]
  app_access: boolean
}

const receiveCondition = (role: DirectusRole) => {
  return role.app_access === true
}

export async function useGetNotificationRecipientIds(): Promise<string[]> {
  const directusUrl = useRuntimeConfig().public.directus.url
  const { token } = useDirectusToken()

  const url = `${directusUrl}/roles?access_token=${token.value}`

  const { data } = (await useFetch(url)) as {
    data: Ref<{ data: DirectusRole[] }>
  }

  return data.value.data
    .filter(receiveCondition)
    .flatMap(role => role?.users)
}
