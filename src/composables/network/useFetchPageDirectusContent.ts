import { computedAsync } from '@vueuse/core'
import { type RouteLocationNormalized } from 'vue-router'

export async function useFetchPageDirectusContent(
  slug: string | undefined,
  fields: string[],
) {
  if (!slug) { return null }

  const directusPageContent = await useFetchDirectusPageItem({
    pageName: slug as string,
    status: ['published-public', 'published-private'],
    fields,
  })

  return directusPageContent ?? null
}

export function useComputedDirectusPageContent(
  route: RouteLocationNormalized,
): Ref<GpsPage | null> {
  return computedAsync(() => {
    const slug = route.params?.slug?.[0] as string | undefined

    if (!slug) { return null }

    return useFetchPageDirectusContent(slug, ['title', 'metatitle', 'metadescription'])
  }, null)
}
