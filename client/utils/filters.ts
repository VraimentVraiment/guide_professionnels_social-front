import {
  type HierarchyNode,
} from 'd3-hierarchy'


export const fetchFilterCollection = async (
  collection: FiltersCollection,
) => {
  const items = (
    await useFetchDirectusItems<DirectusFilterItem>({
      collectionName: collection.name,
    })
  )
    .map((item) => {
      return directusItemToFilterItem(item, collection.name)
    })

  return {
    ...collection,
    items,
  }
}

/**
 * Converts a DirectusFilterItem into a FilterItem.
 */
export function directusItemToFilterItem (
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
    combination: item.combination,
  }
}

/**
 * Creates a hierarchical representation of a FiltersCollection using d3-hierarchy's `stratify` function.
 */
export function stratifyFilters (
  collection: FiltersCollection,
): HierarchyNode<RootFilterItem> | null {
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
