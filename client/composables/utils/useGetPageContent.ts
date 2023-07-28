import { computedAsync } from '@vueuse/core'

type GpsContentPage = {
  title: string
  metatitle?: string
  metadescription?: string
  content?: string
}

export function useGetPageContent () {
  const route = useRoute()

  return computedAsync(async () => {
    const slug = route.params?.slug?.[0] ?? route.name as string

    if (!slug) {
      return null
    }

    const pageContent = (
      await getDirectusPageContent(slug)
    ) ?? (
      await getNuxtPageContent(slug)
    )

    return pageContent
  })
}

async function getDirectusPageContent (
  routeName?: string,
): Promise<GpsContentPage | null> {
  const pages = await useFetchDirectusItems<GpsContentPage>({
    collectionName: 'gps_pages',
    params: {
      filter: {
        status: {
          _in: ['published-public', 'published-private'],
        },
        slug: routeName,
      },
      fields: ['title', 'slug', 'metatitle', 'metadescription', 'content'],
    },
  })

  return pages?.[0] ?? null
}

async function getNuxtPageContent (
  routeName: string,
): Promise<GpsContentPage | null> {
  const pages = await useGetContent('/pages')

  return pages?.[routeName] ?? null
}
