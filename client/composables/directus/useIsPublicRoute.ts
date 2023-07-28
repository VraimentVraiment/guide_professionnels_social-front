const DEFAULT_PUBLIC_PAGES = [
  'login',
  '404',
]

/**
 * Check if a page's status is set to public in Directus, given its name.
 */
export async function useIsPublicPage (pageName: string) {
  if (DEFAULT_PUBLIC_PAGES.includes(pageName)) {
    return true
  }

  const pages = await useFetchDirectusPageItem(pageName, ['published-public'], ['id'])

  return pages?.length > 0
}
