import { describe, it, expect } from 'vitest'
import { useCollectionObserver } from './useCollectionObserver'

describe('useCollectionObserver', () => {
  it('should initialize with an empty collection', () => {
    const { collection } = useCollectionObserver<number>()

    expect(collection.value).toEqual([])
  })

  it('should add an item to the collection', () => {
    const { collection, add } = useCollectionObserver<number>()

    add(1)

    expect(collection.value).toEqual([1])
  })

  it('should check if an item is in the collection', () => {
    const { has, add } = useCollectionObserver<number>()

    add(1)

    expect(has(1)).toBe(true)
    expect(has(2)).toBe(false)
  })

  it('should remove an item from the collection', () => {
    const { collection, add, remove } = useCollectionObserver<number>()

    add(1)
    remove(1)

    expect(collection.value).toEqual([])
  })

  it('should toggle an item in the collection', () => {
    const { collection, add, toggle } = useCollectionObserver<number>()

    add(1)
    toggle(1)

    expect(collection.value).toEqual([])
  })
})
