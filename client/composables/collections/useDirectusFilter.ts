import {
  intersection,
} from 'd3-array'

/**
 * Return, for each collection used in the app,
 * the reactive filters to use when querying Directus.
 */
export function useDirectusFilters(
  postsCollectionName: Ref<string | null>,
  filtersCollections: Ref<FiltersCollection[]>,
  checkedItems: ComputedRef<FiltersCollection[]>,
  relationsCollections: Ref<RelationsCollection[]>,
  // relationGroups: ComputedRef<RelationGroups>,
): ComputedRef<CollectionDirectusFilter[]> {
  const directusFilters = computed(() => {
    const { collectionsModels } = useCollectionsModelsStore()

    return collectionsModels
      .filter((collectionModel) => {
        return (
          postsCollectionName.value === collectionModel.collectionName ||
          filtersCollections.value
            .some((collection) => {
              return (
                collection.collectionName === collectionModel.collectionName
              )
            })
        )
      })
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
              // relationGroups,
            ) ?? []

            ids.push(newIds)
          }
        }

        const idsIntersection = ids.some(ids => ids.length === 0)
          ? []
          : Array.from(intersection(...ids))

        if (ids.length) {
          addFilterCondition({
            id: {
              _in: idsIntersection,
            },
          })
        }

        if (collectionModel.filterStatus) {
          addFilterCondition({
            status: {
              _in: collectionModel.filterStatus,
            },
          })
        }

        return filter
      })
  })

  return directusFilters
}
