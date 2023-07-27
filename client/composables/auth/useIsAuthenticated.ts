/**
 * Returns true if the user is authenticated in Directus, false otherwise.
 */
export async function useIsAuthenticated (): Promise<ComputedRef<boolean>> {
  const { fetchUser } = useDirectusAuth()

  const user = await fetchUser()

  return computed(() => {
    return !!user.value
    // return false
    // return true
  })
}
