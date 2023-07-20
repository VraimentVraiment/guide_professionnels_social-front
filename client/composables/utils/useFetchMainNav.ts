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
  const navigationMenu = (await useFetchDirectusItems<GpsSiteNavMenu>({
    collectionName: 'gps_site',
    params: {
      fields: [
        'navigation_menu.collection',
        'navigation_menu.item:gps_pages.title',
        'navigation_menu.item:gps_pages.slug',
        'navigation_menu.item:gps_pages_groups.name',
        'navigation_menu.item:gps_pages_groups.pages.title',
        'navigation_menu.item:gps_pages_groups.pages.slug',
      ],
    },
  })) as unknown as GpsSiteNavMenu // site collection is a singleton

  console.log('siteProps :', navigationMenu)

  return navigationMenu.navigation_menu
    .map((el) => {
      if (el.collection === 'gps_pages_groups') {
        const item = el.item as { name: string, pages: GpsPage[] }
        return {
          title: item.name,
          links: item.pages.map(page => ({
            text: page.title,
            to: `/${page.slug}`,
            toggleId () {
              console.log('toggleId :', page.slug)
            },
          })),
        }
      } else if (el.collection === 'gps_pages') {
        const item = el.item as GpsPage
        return {
          text: item.title,
          to: `/${item.slug}`,
        }
      }

      return null
    })
    .filter(el => el !== null) as DsfrNavItem[]
}
