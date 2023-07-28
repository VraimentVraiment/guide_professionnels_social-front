import {
  stratify as getStratifier,
  type HierarchyNode,
} from 'd3-hierarchy'

/**
 * Create a stratified tree from an array of items with parent-child relationships.
 * Wrapper around d3.stratify().
 * @see https://observablehq.com/@d3/d3-stratify
 */
export function stratify <T>(
  items: T[],
  getId: Accessor<T, string | null>,
  getParentId: Accessor<T, string | null>,
  getRootFilterItem: () => T,
): HierarchyNode<T> | null {
  const d3stratify = getStratifier<T>()
    .id(getId)
    .parentId(getParentId)

  const tabularItems = [...items]

  const hasRootItem = items.some((item) => {
    return getParentId(item) === null
  })

  if (!hasRootItem) {
    tabularItems.push(getRootFilterItem())
  }

  return d3stratify(tabularItems)
}
