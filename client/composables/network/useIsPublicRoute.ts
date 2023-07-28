const DEFAULT_PUBLIC_PAGES = [
  'login',
  '404',
]

/**
 * Check if a page's status is set to public in Directus, given its name.
 */
export async function useIsPublicPage(pageName: string) {
  if (DEFAULT_PUBLIC_PAGES.includes(pageName)) {
    return true
  }

  const page = await useFetchDirectusPageItem({
    pageName,
    status: ['published-public'],
    fields: ['id'],
  })

  return Boolean(page)
}
