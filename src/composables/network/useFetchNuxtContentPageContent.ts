import { computedAsync } from '@vueuse/core'

export function useFetchNuxtContentPageContent() {
  const nuxtContentPageContent = computedAsync(async() => {
    return await queryContent('/pages-meta').findOne()
  }, null)

  return nuxtContentPageContent
}
