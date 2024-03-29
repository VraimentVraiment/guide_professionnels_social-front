/**
 * Returns a list of posts filtered by the selected cities
 */
export function useLocalisedPostItems<PostType extends GpsLocalizedPost>(
  postsCollection: Ref<PostsCollection<PostType>>,
) {
  const searchStore = useLocationSearchStore()

  const localisedPostItems = computed(() => {
    const items = postsCollection?.value?.items || []

    if (!searchStore.selectedCityList?.length) {
      return items
    }

    return items
      ?.filter((post) => {
        return addressMatch(post.addresses, searchStore.selectedCityList)
      })
  })

  return localisedPostItems
}
