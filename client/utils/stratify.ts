import {
  stratify as getStratifier,
  type HierarchyNode,
} from 'd3-hierarchy'

/**
 * Create a stratified tree from an array of items with parent-child relationships.
 * Wrapper around d3.stratify().
 * @see https://observablehq.com/@d3/d3-stratify
 */
export function stratify<T>(
  items: T[],
  getId: Accessor<T, string | null>,
  getParentId: Accessor<T, string | null>,
  getRootFilterItem: () => T,
): HierarchyNode<T> | null {
  /**
   * Use a copy of the items
   */
  const tabularItems = [...items]

  /**
   * If the array does not contain a root item, create one and add it to the array.
   */
  const hasRootItem = items.some((item) => {
    return getParentId(item) === null
  })
  if (!hasRootItem) {
    tabularItems.push(getRootFilterItem())
  }

  /**
   * Detect circular references so that d3.stratify() does not throw an error.
  */
  const circularReferences = tabularItems
    .filter((item) => {
      const chain: string[] = []
      let limit = 10
      let currentItemId = getId(item)
      while (
        currentItemId !== null &&
        currentItemId !== undefined &&
        currentItemId !== '0' &&
        limit > 0
      ) {
        if (chain.includes(currentItemId)) {
          return true
        }
        chain.push(currentItemId)
        limit--
        const currentItem = tabularItems.find((ti) => {
          return getId(ti) === currentItemId
        })
        if (!currentItem) {
          return false
        }
        const parentItem = tabularItems.find((ti) => {
          return getId(ti) === getParentId(currentItem)
        })
        if (!parentItem) {
          return false
        }
        currentItemId = getId(parentItem)
      }
      return false
    })
    .map(item => getId(item))

  const stratifyOperator = getStratifier<T>()
    .id(getId)
    .parentId((item: T) => {
      const id = getId(item)
      const circularReference = circularReferences.find(crId => crId === id)
      if (circularReference && id) {
        console.warn('Circular reference detected with item:', item)
        return '0'
      }
      return getParentId(item)
    })

  return stratifyOperator(tabularItems)
}
