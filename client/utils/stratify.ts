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
  idAccessor: Accessor<T>,
  parentAccessor: Accessor<T>,
  getRootFilterItem: () => T,
): HierarchyNode<T> | null {
  const d3stratify = getStratifier<T>()
    .id(idAccessor)
    .parentId(parentAccessor)

  const tabularItems = getStratifiableItems<T>(
    items,
    getRootFilterItem,
    parentAccessor,
  )

  return d3stratify(tabularItems)
}

/**
 * Make sure items can be used to create a stratified tree,
 * verifying if array has a root node, or add one if it doesn't.
 */
function getStratifiableItems<T> (
  items: T[],
  getRootItem: () => T,
  parentAccessor: Accessor<T>,
): (T)[] {
  const tabularItems = [...items]

  if (!hasRootNode<T>(items, parentAccessor)) {
    tabularItems.push(getRootItem())
  }

  return tabularItems
}

/**
 * Check if an array of items has a root node.
 */
function hasRootNode<T> (
  items: T[],
  parentAccessor: Accessor<T>,
): boolean {
  return items.some(item => parentAccessor(item) === null)
}
