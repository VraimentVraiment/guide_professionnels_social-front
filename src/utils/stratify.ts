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
   * Detect circular references which would break the stratify operator.
   */
  const circularReferences = tabularItems
    .reduce(getCicularReferences<T>(tabularItems, getId, getParentId), [])

  const stratifyOperator = getStratifier<T>()
    .id(getId)
    .parentId((item: T) => {
      const id = getId(item)
      if (
        id &&
        circularReferences.find(crId => crId === id)
      ) {
        warn('Circular reference detected with item:', item)
        /**
         * If the item is part of a circular reference, make it a child of the root item.
         * This might be improved by returning another id, according to the circular reference shape.
         */
        return '0'
      } else {
        return getParentId(item)
      }
    })

  return stratifyOperator(tabularItems)
}

/**
 * Given an array of items with parent-child relationships,
 * return an array of ids that are part of a circular reference.
 */
function getCicularReferences<T>(
  items: T[],
  getId: Accessor<T, string | null>,
  getParentId: Accessor<T, string | null>,
) {
  return (circularReferences: string[], item: T) => {
    const chain: string[] = []
    let limit = 10
    let currId = getId(item)

    while (
      currId !== null &&
      currId !== undefined &&
      currId !== '0' &&
      limit > 0
    ) {
      if (chain.includes(currId)) {
        circularReferences.push(currId)
        break
      }

      chain.push(currId)
      limit--

      const currentItem = items
        .find((ti) => {
          return getId(ti) === currId
        })
      if (!currentItem) {
        break
      }

      const parentItem = items
        .find((ti) => {
          return getId(ti) === getParentId(currentItem)
        })
      if (!parentItem) {
        break
      }
      currId = getId(parentItem)
    }

    return circularReferences
  }
}
