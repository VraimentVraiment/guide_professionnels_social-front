export const getDirectusFilter = (
  directusFilters: CollectionDirectusFilter[],
  collectionName: string,
): DirectusFilter => {
  const directusFilter = directusFilters
    ?.find((filter) => {
      return filter.collectionName === collectionName
    })
    ?.filter ?? {}

  return directusFilter
}

export function useDirectusFilters (
  collectionsModels: ComputedRef<(CollectionModel | null)[]>,
  checkedItems: ComputedRef<FiltersCollection[]>,
  relationsCollections: Ref<RelationsCollection[]>,
  filtersCollections: Ref<FiltersCollection[]>,
): ComputedRef<CollectionDirectusFilter[]> {
  const directusFilters = computed(() => {
    return collectionsModels.value
      ?.map((collectionModel): CollectionDirectusFilter => {
        const filter: CollectionDirectusFilter = {
          collectionName: collectionModel?.collectionName as string,
          filter: {},
        }

        const relationsModel = collectionModel?.relations
        if (!relationsModel) {
          return filter
        }

        const addFilterCondition = (
          condition: Record<string, unknown>,
        ) => {
          filter.filter._and ??= []
          filter.filter._and.push(condition)
        }

        for (const relationModel of relationsModel) {
          const collectionCheckedItems = checkedItems.value
            ?.find((collection: FiltersCollection) => {
              return collection.collectionName === relationModel.collectionName
            })?.items

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
            const junction = relationsCollections.value
              ?.find(j => (
                j.sourceCollectionName === collectionModel.collectionName &&
                j.targetCollectionName === relationModel.collectionName
              ))

            if (!junction) {
              continue
            }

            const filtersCollection = filtersCollections.value
              ?.find((collection) => {
                return collection.collectionName === relationModel.collectionName
              })

            if (!filtersCollection) {
              continue
            }

            const ids = getMatchingIds({
              junction,
              checkedItems: collectionCheckedItems,
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
