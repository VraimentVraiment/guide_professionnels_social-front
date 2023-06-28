export function useDirectusFilters (
  filtersCollections: Ref<FiltersCollection[]>,
  relationsCollections: Ref<RelationsCollection[]>,
): ComputedRef<CollectionDirectusFilter[]> {
  const directusFilters = computed(() => {
    const { collectionsModels } = useCollectionsModelsStore()

    return collectionsModels
      ?.map((collectionModel): CollectionDirectusFilter => {
        const filter: CollectionDirectusFilter = {
          collectionName: collectionModel?.collectionName as string,
          filter: {},
        }

        if (!collectionModel?.relations) {
          return filter
        }

        const addFilterCondition = (
          condition: Record<string, unknown>,
        ) => {
          filter.filter._and ??= []
          filter.filter._and.push(condition)
        }

        for (const relationModel of collectionModel?.relations) {
          const checkedItems = getCheckedItems(filtersCollections.value, relationModel.targetCollectionName)

          if (
            !checkedItems ||
            checkedItems.length === 0
          ) {
            continue
          }

          if (relationModel.relationType === 'many-to-one') {
            addFilterCondition({
              [relationModel.field as string]: {
                _in: checkedItems
                  .map((item: FilterItemNode) => item.id),
              },
            })
          }

          if (relationModel.relationType === 'many-to-many') {
            const relationsCollection = relationsCollections.value
              ?.find(c => (
                c.relationModel.sourceCollectionName === collectionModel.collectionName &&
                c.relationModel.targetCollectionName === relationModel.targetCollectionName
              ))

            if (!relationsCollection) {
              continue
            }

            const filtersCollection = filtersCollections.value
              ?.find((collection) => {
                return collection.collectionName === relationModel.targetCollectionName
              })

            if (!filtersCollection) {
              continue
            }

            const ids = getMatchingIds({
              relationsCollection,
              checkedItems,
              filtersCollection,
              relationModel,
            })

            if (!ids?.length) {
              // console.log('no dispositifsIds', dispositifsIds)
            }

            addFilterCondition({
              id: {
                _in: ids,
              },
            })
          }
        }
        return filter
      })
  })

  return directusFilters
}
