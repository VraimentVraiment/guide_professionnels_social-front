import {
  stratify as getStratifier,
  type HierarchyNode,
} from 'd3-hierarchy'

/**
 * Create a stratified tree layout from an array of items with parent-child relationships.
 * Wrapper around d3.stratify().
 * @see https://observablehq.com/@d3/d3-stratify
 */
export function stratify <T> (
  items: T[],
  idAccessor: Accessor<T, string | null>,
  parentAccessor: Accessor<T, string | null>,
  getRootFilterItem: () => T,
): HierarchyNode<T> | null {
  const d3stratify = getStratifier<T>()
    .id(idAccessor)
    .parentId(parentAccessor)

  const tabularItems = [...items]

  const hasRootItem = items.some((item) => {
    return parentAccessor(item) === null
  })

  if (!hasRootItem) {
    tabularItems.push(getRootFilterItem())
  }

  return d3stratify(tabularItems)
}
