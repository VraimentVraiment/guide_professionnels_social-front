/**
 * A watcher that will trigger a collection's items fetching when a filter is toggled,
 * if the collection is related to the filter.
 */
export function useWatchPostFiltering(
  postsCollectionName: Ref<string | null>,
  filtersCollections: Ref<FiltersCollection[]>,
  fetchCollection: (collectionName: string) => Promise<void>,
) {
  const { getDependentCollectionsModels } = useModelsStore()

  const watchPostFiltering = () => {
    for (const filtersCollection of filtersCollections.value) {
      watch(
        filtersCollection,
        () => {
          const dependentTaxonomiesCollections = getDependentCollectionsModels(filtersCollection.collectionName, 'taxonomy')
            ?.filter((collection) => {
              return filtersCollections.value
                .some(({ collectionName }) => {
                  return collectionName === collection.collectionName
                })
            })

          if (dependentTaxonomiesCollections?.length) {
            dependentTaxonomiesCollections.forEach(({ collectionName }) => {
              fetchCollection(collectionName)
            })
          } else {
            fetchCollection(postsCollectionName.value as string)
          }
        }, {
          immediate: true,
        })
    }
  }

  return watchPostFiltering
}
