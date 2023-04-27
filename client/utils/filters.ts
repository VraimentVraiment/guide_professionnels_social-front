import {
  HierarchyNode,
} from 'd3-hierarchy'

/**
 * Creates a hierarchical representation of a FiltersCollection using d3-hierarchy's `stratify` function.
 */
export function stratifyFilters (
  collection: FiltersCollection,
): HierarchyNode<FilterItemNode> | null {
  const idAccessor: Accessor<FilterItemNode> = (item) => {
    return item.id?.toString() || null
  }

  const parentAccessor: Accessor<FilterItemNode> = (item) => {
    return item.parent_id?.toString() || null
  }

  const getRootFilterItem = (): RootFilterItem => {
    return {
      id: 0,
      parent_id: null,
      name: collection.name,
    }
  }

  return stratify<FilterItemNode>(
    collection.items,
    idAccessor,
    parentAccessor,
    getRootFilterItem,
  )
}

/**
 * Converts a DirectusFilterItem into a FilterItem.
 */
export function DirectusItemToFilterItem (
  item: DirectusFilterItem,
  collectionName: string,
): FilterItem {
  return {
    id: item.id,
    name: item.name,
    parent_id: item.parent_id,
    children: item.children,
    collectionName,
    checked: false,
  }
}
