import {
  type DirectusUser,
} from 'nuxt-directus/dist/runtime/types'

/**
 * @todo find a way to get the admin roles ids from the directus api.
 * Right now we are hardcoding it.
 */

export async function useGetNotificationRecipientIds(): Promise<string[]> {
  // const rolesIds = {
  //   admin: 'bf383d1c-33e1-4b93-bf10-d5d179489b0c',
  //   superAdmin: '236ca5a2-d117-470a-abdf-f905bd2d208d',
  // }
  const roles = await useGetDirectusRoles()
  const adminRolesIds = roles.value.data
    .filter((role) => {
      return [
        'Admin',
        'Super-admin',
      ].includes(role?.name)
    })
    .map(role => role?.id)

  const { getUsers } = useDirectusUsers()
  const adminUsers = await getUsers({
    params: {
      fields: ['id'],
      filter: {
        role: {
          _in: adminRolesIds,
        },
      },
    },
  }) as DirectusUser[]

  return adminUsers
    .map(user => user?.id)
    .filter(Boolean) as string[]
}
