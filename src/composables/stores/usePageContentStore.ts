export const usePageContentStore = defineStore('pageContent', useDefinePageContentStore, {
  persist: PERSISTANCE_CONFIG.PAGE_CONTENT_STORE,
})

type PageContent = {
  title: string
  slug: string
  metatitle: string
  metadescription: string
  content: string
}

function useDefinePageContentStore() {
  const pagesContent = ref<{
    [key: string]: PageContent
  }>({})
  const currentPage = ref<PageContent | null>(null)
}
