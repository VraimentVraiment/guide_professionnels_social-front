import {
  type HierarchyNode,
} from 'd3-hierarchy'

/**
 * Creates a hierarchical representation of a FiltersCollection using d3-hierarchy's `stratify` function.
 */
export function stratifyFilters(
  collection: FiltersCollection,
  collectionModel: CollectionModel,
): HierarchyNode<FilterItemNode> | null {
  const idAccessor: Accessor<FilterItemNode> = (item) => {
    return item.id?.toString() || null
  }

  const parentAccessor: Accessor<FilterItemNode> = (item) => {
    return item.parent_id?.toString() || null
  }

  const getRootFilterItem = (): FilterItemNode => {
    const relationModel = collectionModel.relations
      ?.find(relation => relation.collectionName === collection.collectionName) as CollectionRelationModel
    return {
      id: 0,
      parent_id: null,
      relationModel,
      name: relationModel.collectionName,
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