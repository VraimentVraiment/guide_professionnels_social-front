import { useArrayDifference as useVueUseArrayDifference } from '@vueuse/core'
import { Primitive } from 'd3-array'

export function useArrayDifference<T> (
  oldArray: T[],
  newArray: T[],
  accessor: (el: T) => Primitive,
) {
  const compareFn = (v1: T, v2: T) => accessor(v1) === accessor(v2)

  const added = useVueUseArrayDifference(oldArray, newArray, compareFn).value
  const removed = useVueUseArrayDifference(newArray, oldArray, compareFn).value

  const hasChanges = Boolean(added.length || removed.length)

  return {
    added,
    removed,
    hasChanges,
  }
}
