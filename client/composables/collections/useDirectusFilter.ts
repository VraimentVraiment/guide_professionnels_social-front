import {
  intersection,
} from 'd3-array'

export function useDirectusFilters (
  filtersCollections: Ref<FiltersCollection[]>,
  checkedItems: ComputedRef<FiltersCollection[]>,
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

        const ids: number[][] = []

        for (const relationModel of collectionModel?.relations) {
          const collectionCheckedItems = checkedItems.value
            ?.find((collection) => {
              return collection.collectionName === relationModel.targetCollectionName
            })
            ?.items

          if (
            !collectionCheckedItems ||
            collectionCheckedItems.length === 0
          ) {
            continue
          }

          if (relationModel.relationType === 'many-to-one') {
            addFilterCondition({
              [relationModel.field as string]: {
                _in: collectionCheckedItems
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

            const newIds = getIdsMatchingRelatedCollection(
              filtersCollection,
              relationsCollection,
              relationModel,
              collectionCheckedItems,
            )

            if (newIds?.length) {
              ids.push(newIds)
            }
          }
        }

        if (ids.length) {
          addFilterCondition({
            id: {
              _in: Array.from(intersection(...ids)),
            },
          })
        }

        return filter
      })
  })

  return directusFilters
}
