/**
 * Returns true if the user is authenticated in Directus, false otherwise.
 */
export async function useIsAuthenticated (): Promise<ComputedRef<boolean>> {
  const user = useDirectusUser()

  const { fetchUser } = useDirectusAuth()

  const test = await fetchUser()

  return computed(() => {
    console.log('test :', test.value)
    console.log('user.value :', user.value)
    return Boolean(user.value || test.value)
    // return false
    // return true
  })
}
