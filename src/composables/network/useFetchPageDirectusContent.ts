import { computedAsync } from '@vueuse/core'
import { type RouteLocationNormalized } from 'vue-router'

export function useFetchPageDirectusContent(
  route: RouteLocationNormalized,
  fields: string[],
) {
  const pageContent = computedAsync(async() => {
    const slug = route.params?.slug?.[0]
    if (!slug) { return null }

    const directusPageContent = await useFetchDirectusPageItem({
      pageName: slug as string,
      status: ['published-public', 'published-private'],
      fields,
      // fields: ['title', 'slug', 'metatitle', 'metadescription', 'content'],
    })

    if (!directusPageContent) { return null }

    return directusPageContent
  })

  return pageContent
}
