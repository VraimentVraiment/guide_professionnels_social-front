import {
  type HierarchyNode,
} from 'd3-hierarchy'


/**
 * Creates a hierarchical representation of a FiltersCollection using d3-hierarchy's `stratify` function.
 */
export function stratifyFilters(
  collection: FiltersCollection,
): HierarchyNode<FilterItemNode> | null {
  const idAccessor: Accessor<FilterItemNode> = (item) => {
    return item.id?.toString() || null
  }

  const parentAccessor: Accessor<FilterItemNode> = (item) => {
    return item.parent_id?.toString() || null
  }

  const getRootFilterItem = (): FilterItemNode => {
    return {
      id: 0,
      parent_id: null,
      collection,
      name: collection.name,
    }
  }

  /**
   * TODO: Make sure items parent_id being null doesn't break the tree.
   * either by specifying a default value in directus or ficing 'stratify' function.
   */
  collection.items.forEach((item) => {
    if (!item?.parent_id) {
      item.parent_id = 0
    }
  })

  return stratify<FilterItemNode>(
    collection.items,
    idAccessor,
    parentAccessor,
    getRootFilterItem,
  )
}

export const getDirectusFilter = ({
  relationsModel,
  checkedItems,
  relationsCollections,
  filtersCollections,
}: {
  relationsModel: DirectusRelation[],
  checkedItems: Ref<CheckedItems>,
  relationsCollections: DirectusFilter[],
  filtersCollections: FiltersCollection[],
}): DirectusFilter => {

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

    const collectionCheckedItems = checkedItems?.value?.find((collection) => {
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
            .map(item => item.id),
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

      const dispositifsIds = getMatchingIds({
        junction,
        checkedItems: collectionCheckedItems,
        filtersCollection,
        relationModel,
      })

      if (!dispositifsIds?.length) {
        console.log('no dispositifsIds', dispositifsIds)
      }

      addFilterCondition({
        'id': {
          "_in": dispositifsIds,
        },
      })
    }
  }
  return filter
}