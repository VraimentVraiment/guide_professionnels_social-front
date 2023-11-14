export async function useFetchMainNav(
  isAuthenticated: boolean,
): Promise<DsfrNavItem[]> {
  const { navigation_menu: navigationMenu } = (
    await useFetchDirectusItems<GpsSiteNavMenu>({
      collectionName: 'gps_site',
      params: {
        fields: [
          'navigation_menu.collection',
          'navigation_menu.item:gps_pages.title',
          'navigation_menu.item:gps_pages.slug',
          'navigation_menu.item:gps_pages.status',
          'navigation_menu.item:gps_pages_groups.name',
          'navigation_menu.item:gps_pages_groups.pages.title',
          'navigation_menu.item:gps_pages_groups.pages.slug',
          'navigation_menu.item:gps_pages_groups.pages.status',
        ],
      },
    })) as unknown as {
    navigation_menu: GpsSiteNavMenu
  } // 'gps_site' collection is defined as a singleton in directus, we can safely cast to GpsSiteNavMenu

  const navItems = navigationMenu
    .map(({ collection: collectionName, item }) => {
      if (!item) { return null }

      switch (collectionName) {
        case 'gps_pages_groups':
          return gpsPageGroupToDsfrNavMenuItem(item as GpsPagesGroup)
        case 'gps_pages':
          return gpsPageToDsfrNavItem(item as GpsPage)
        default:
          return null
      }
    })
    .filter(el => el !== null) as DsfrNavItem[]

  return navItems ?? []

  function gpsPageToDsfrNavItem(
    page: GpsPage,
  ): DsfrNavigationMenuLinkProps | null {
    if (filterPageStatus(page)) {
      return gpsPagePropsToDsfrPageProps(page)
    } else {
      return null
    }
  }

  function gpsPageGroupToDsfrNavMenuItem(
    pageGroup: GpsPagesGroup,
  ): DsfrNavItem | null {
    const links = pageGroup.pages
      .filter(filterPageStatus)
      .map(gpsPagePropsToDsfrPageProps)

    if (links.length > 0) {
      return {
        title: pageGroup.name,
        links,
      }
    }

    return null
  }

  function gpsPagePropsToDsfrPageProps(
    page: GpsPage,
  ): DsfrNavigationMenuLinkProps {
    return {
      text: page.title,
      to: `/content/${page.slug}`,
    }
  }

  function filterPageStatus(
    page: GpsPage,
  ) {
    if (isAuthenticated) {
      return (
        page.status === 'published-private' ||
        page.status === 'published-public'
      )
    } else {
      return page.status === 'published-public'
    }
  }
}
