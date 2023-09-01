import { computedAsync } from '@vueuse/core'

export function useFetchPageContent(): Ref<GpsPage | null> {
  const route = useRoute()

  return computedAsync(async() => {
    const slug = route.params?.slug?.[0] ?? route.name as string

    if (!slug) {
      return null
    }

    const directusPage = await useFetchDirectusPageItem({
      pageName: slug,
      status: ['published-public', 'published-private'],
      fields: ['title', 'slug', 'metatitle', 'metadescription', 'content'],
    })

    const pageContent = directusPage ?? (
      await useFetchNuxtPageContent(slug)
    )

    return pageContent
  })
}
