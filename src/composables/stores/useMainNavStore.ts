export const useMainNavStore = defineStore('mainNav', () => {
  const navItems = ref<any | null>(null)

  const fetchNavItems = async(isAuthenticated: Ref<boolean>) => {
    const content = await queryContent('/components/main-nav').findOne() as unknown as {
      props: {
        navItems: DsfrNavigationMenuLinkProps[]
      }
    }

    const directusNavItems = await useFetchDirectusNav(isAuthenticated.value)

    const contentNavItems = content.props.navItems
      ?.filter((navItem: DsfrNavigationMenuLinkProps & { public?: boolean }) => {
        return isAuthenticated.value || navItem.public
      }) ?? []

    navItems.value = [
      ...directusNavItems,
      ...contentNavItems,
    ]
  }

  const init = () => {
    const isAuthenticated = useIsAuthenticated()

    onMounted(() => {
      if (!navItems?.value) {
        fetchNavItems(isAuthenticated)
      }
    })

    watch(isAuthenticated, () => {
      fetchNavItems(isAuthenticated)
    })
  }

  return {
    navItems,
    fetchNavItems,
    init,
  }
})
