/**
 * Returns true if the user is authenticated in Directus, false otherwise.
 */
export function useIsAuthenticated (): ComputedRef<boolean> {
  const user = useDirectusUser()

  return computed(() => {
    console.log('user.value :', user.value)
    return Boolean(user.value)
    // return false
    // return true
  })
}
