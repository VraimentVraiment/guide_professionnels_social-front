export function useCollectionObserver<T> () {
  const collection = ref<T[]>([]) as Ref<T[]>

  const add = (item: T) => {
    collection.value.push(item)
  }

  const has = (item: T) => {
    return collection.value.includes(item)
  }

  const remove = (item: T) => {
    const index = collection.value.indexOf(item)
    collection.value.splice(index, 1)
  }

  const toggle = (item: T) => {
    if (has(item)) {
      remove(item)
    } else {
      add(item)
    }
  }

  const reset = () => {
    collection.value = []
  }

  return {
    collection,
    add,
    toggle,
    has,
    remove,
    reset,
  }
}
