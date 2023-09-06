import { computedAsync } from '@vueuse/core'

export function useGetPageContent() {
  const route = useRoute()

  const nuxtContentPageContent = computedAsync(async() => {
    return await queryContent('/meta').findOne()
  }, null)

  const directusPageContent = useFetchPageDirectusContent(route, ['title', 'metatitle', 'metadescription'])

  const getMetaTitle = (): string | null => {
    return route.meta?.metatitle as string | undefined ??
      route.meta?.title as string | undefined ??
      nuxtContentPageContent.value?.[route.name as string]?.metatitle ??
      nuxtContentPageContent.value?.[route.name as string]?.title ??
      directusPageContent.value?.metatitle ??
      directusPageContent.value?.title ??
      null
  }
  const getTitle = (): string | null => {
    return route.meta?.title as string | undefined ??
      nuxtContentPageContent.value?.[route.name as string]?.title ??
      directusPageContent.value?.title ??
      null
  }

  return {
    getMetaTitle,
    getTitle,
  }
}
