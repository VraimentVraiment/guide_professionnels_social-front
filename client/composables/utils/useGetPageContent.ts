import { computedAsync } from '@vueuse/core'

type GpsContentPage = {
  title: string
  metatitle?: string
  metadescription?: string
  content?: RichText
}

export function useGetPageContent () {
  const route = useRoute()

  return computedAsync(async () => {
    let slug = route.params?.slug

    if (Array.isArray(slug)) {
      slug = slug[0]
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
  slug?: string,
): Promise<GpsContentPage | null> {
  if (!slug) { return null }
  const pages = await useFetchDirectusItems<GpsContentPage>({
    collectionName: 'gps_pages',
    params: {
      filter: {
        status: {
          _in: ['published-public', 'published-private'],
        },
        slug,
      },
      fields: ['title', 'slug', 'metatitle', 'metadescription', 'content'],
    },
  })

  return pages?.[0] ?? null
}

async function getNuxtPageContent (
  slug: string,
): Promise<GpsContentPage | null> {
  const pages = await useGetContent('/pages')

  return pages?.[slug] ?? null
}
