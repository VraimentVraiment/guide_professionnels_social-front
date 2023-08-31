import { describe, it, expect } from 'vitest'
import { useArrayDifference } from './useArrayDifference'

describe('useArrayDifference', () => {
  it('should return an empty object if both arrays are empty', () => {
    const oldArray: unknown[] = []
    const newArray: unknown[] = []

    const result = useArrayDifference(oldArray, newArray)

    expect(result.added).toEqual([])
    expect(result.removed).toEqual([])
    expect(result.hasChanges).toBe(false)
  })

  it('should return the added and removed items between two arrays', () => {
    const oldArray = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' },
    ]

    const newArray = [
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' },
      { id: 4, name: 'Item 4' },
    ]

    const result = useArrayDifference(oldArray, newArray, item => item.id)

    expect(result.added).toEqual([{ id: 4, name: 'Item 4' }])
    expect(result.removed).toEqual([{ id: 1, name: 'Item 1' }])
    expect(result.hasChanges).toBe(true)
  })

  it('should return an empty object if both arrays are equal', () => {
    const oldArray = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' },
    ]

    const newArray = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' },
    ]

    const result = useArrayDifference(oldArray, newArray, item => item.id)

    expect(result.added).toEqual([])
    expect(result.removed).toEqual([])
    expect(result.hasChanges).toBe(false)
  })
})
