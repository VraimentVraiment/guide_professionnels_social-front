export function useDirectusFilter(
  collectionModel: Ref<CollectionModel | null>,
  checkedItems: ComputedRef<DirectusFilter>,
  relationsCollections: Ref<DirectusFilter[]>,
  filtersCollections: Ref<FiltersCollection[]>,
) {
  const directusFilter = computed(() => {

    const relationsModel = collectionModel.value?.relations

    const filter: DirectusFilter = {}

    const addFilterCondition = (
      condition: Record<string, unknown>,
    ) => {
      filter._and ??= []
      filter._and.push(condition)
    }

    if (!relationsModel) {
      return filter
    }

    for (const relationModel of relationsModel) {

      const collectionCheckedItems = checkedItems.value
        ?.find((collection: FiltersCollection) => {
          return collection.collectionName === relationModel.collectionName
        })?.items

      if (
        !collectionCheckedItems
        || collectionCheckedItems.length === 0
      ) {
        continue;
      }

      if (relationModel.relationType === 'many-to-one') {
        addFilterCondition({
          [relationModel.field as string]: {
            "_in": collectionCheckedItems
              .map((item: FilterItemNode) => item.id),
          },
        })
      }

      if (relationModel.relationType === 'many-to-many') {

        const junction = relationsCollections.value
          ?.find(j => j.collectionName === relationModel.collectionName);

        if (!junction) {
          continue;
        }

        const filtersCollection = filtersCollections.value
          ?.find((collection) => {
            return collection.collectionName === relationModel.collectionName
          })

        if (!filtersCollection) {
          continue;
        }

        const dispositifsIds = getMatchingIds({
          junction,
          checkedItems: collectionCheckedItems,
          filtersCollection,
          relationModel,
        })

        if (!dispositifsIds?.length) {
          // console.log('no dispositifsIds', dispositifsIds)
        }

        addFilterCondition({
          'id': {
            "_in": dispositifsIds,
          },
        })
      }
    }

    return filter
  })

  return directusFilter
}
