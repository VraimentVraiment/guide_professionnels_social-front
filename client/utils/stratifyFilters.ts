import {
  type HierarchyNode,
} from 'd3-hierarchy'

/**
 * Creates a hierarchical representation of a FiltersCollection using d3-hierarchy's `stratify` function.
 */
export function stratifyFilters (
  relationModel: CollectionRelationModel, // TODO use generic object assignment instead
  items: FilterItemNode[],
): HierarchyNode<FilterItemNode> | null {
  const idAccessor: Accessor<FilterItemNode> = (item) => {
    return item.id?.toString() || null
  }

  const parentAccessor: Accessor<FilterItemNode> = (item) => {
    return item.parent_id?.toString() || null
  }

  /**
   * TODO: Make sure items parent_id being null doesn't break the tree.
   * either by specifying a default value in directus or fixing 'stratify' function.
   */
  items.forEach((item) => {
    if (!item?.parent_id) {
      item.parent_id = 0
    }
  })

  return stratify<FilterItemNode>(
    items,
    idAccessor,
    parentAccessor,
    () => getRootFilterItemNode(relationModel),
  )
}
