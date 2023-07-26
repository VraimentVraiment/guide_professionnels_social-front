import { RouteLocationRaw } from 'vue-router'

type DsfrNavigationMenuLinkProps = {
  text?: string | undefined;
  to?: RouteLocationRaw | undefined;
};

type DsfrNavItem = DsfrNavigationMenuLinkProps | {
  title?: string | undefined;
  links?: DsfrNavigationMenuLinkProps[]
}

type GpsPage = {
  title: string,
  slug: string,
  status: PageStatus
}

type GpsSiteNavMenu = {
  navigation_menu: {
    collection: 'gps_pages' | 'gps_pages_groups',
    item: GpsPage | {
      name: string,
      pages: GpsPage[]
    }
  }[]
}

export async function useFetchMainNav (): Promise<DsfrNavItem[]> {
  if (process.server) { return [] }

  const isAuthenticated = useIsAuthenticated().value

  const navigationMenu = (await useFetchDirectusItems<GpsSiteNavMenu>({
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
  })) as unknown as GpsSiteNavMenu // site collection is a singleton

  return navigationMenu.navigation_menu
    .map((el) => {
      if (el.collection === 'gps_pages_groups') {
        const pageGroup = el.item as { name: string, pages: GpsPage[] }

        const links = pageGroup.pages
          .filter(filterPageStatus)
          .map(page => ({
            text: page.title,
            to: `/content/${page.slug}`,
          }))

        if (links.length > 0) {
          return {
            title: pageGroup.name,
            links,
          }
        }
      } else if (el.collection === 'gps_pages') {
        const page = el.item as GpsPage | null
        if (page && filterPageStatus(page)) {
          return {
            text: page.title,
            to: `/content/${page.slug}`,
          }
        }
      }

      return null
    })
    .filter(el => el !== null) as DsfrNavItem[]

  function filterPageStatus (
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
