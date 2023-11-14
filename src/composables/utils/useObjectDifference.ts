export function useObjectDifference(
  oldObj: Record<string, unknown> | Ref<Record<string, unknown>>,
  newObj: Record<string, unknown> | Ref<Record<string, unknown>>,
) {
  const unRefOldObj = unref(oldObj)
  const unRefNewObj = unref(newObj)
  const diff = Object.keys(unRefNewObj)
    .reduce((acc: Record<string, unknown>, key) => {
      if (unRefNewObj[key] !== unRefOldObj[key]) {
        acc[key] = unRefNewObj[key]
      }
      return acc
    }, {})

  return diff
}
