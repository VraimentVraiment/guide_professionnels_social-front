import { computedAsync } from '@vueuse/core'

export async function useGetContent (
  path: string,
): Promise<RecursiveYmlContent> {
  return (await queryContent(path).findOne()) as RecursiveYmlContent
}

export async function useGetPageContent () {
  const route = useRoute()
  const content = await useGetContent('/pages')

  return computedAsync(() => {
    const page = content[route.name as keyof typeof content]

    const metaTitle = page.metaTitle ?? page.title ?? null
    const title = page.title ?? null
    const metaDescription = page.metaDescription ?? null

    return {
      metaTitle,
      title,
      metaDescription,
    }
  })
}
