export function useIsAuthenticated (): ComputedRef<boolean> {
  // const user = useDirectusUser()

  return computed(() => {
    // return Boolean(user.value)
    // return false
    return true
  })
}
