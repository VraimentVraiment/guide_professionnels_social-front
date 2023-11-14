/**
 * Returns true if the user is authenticated in Directus, false otherwise.
 */
export function useIsAuthenticated(): ComputedRef<boolean> {
  const user = useDirectusUser()
  return computed(() => {
    return !!user.value
    // return false
    // return true
  })
}
