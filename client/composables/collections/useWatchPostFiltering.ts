export function useWatchPostFiltering (
  filtersCollections: Ref<FiltersCollection[]>,
  fetchFiltersCollection: (collectionName: string) => Promise<void>,
  fetchPostsCollection: () => Promise<void>,
) {
  const { getDependentCollections } = useCollectionsModelsStore()

  const watchPostFiltering = () => {
    for (const filtersCollection of filtersCollections.value) {
      watch(
        filtersCollection,
        () => {
          const dependentTaxonomiesCollections = getDependentCollections(filtersCollection.collectionName, 'taxonomy')
            ?.filter((collection) => {
              return filtersCollections.value
                .some(({ collectionName }) => {
                  return collectionName === collection.collectionName
                })
            })
          if (dependentTaxonomiesCollections?.length) {
            dependentTaxonomiesCollections.forEach(({ collectionName }) => {
              fetchFiltersCollection(collectionName)
            })
          } else {
            fetchPostsCollection()
          }
        })
    }
  }

  return watchPostFiltering
}
