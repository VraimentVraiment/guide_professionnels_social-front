import { expect } from 'vitest'

describe('stratify', () => {
  type ItemType = {
    id: string
    parentId: string | null
  }
  const getId = (item: ItemType) => item.id
  const getParentId = (item: ItemType) => item.parentId
  const getRootFilterItem = () => ({ id: '0', parentId: null })

  it('should create a stratified tree from an array of items with parent-child relationships', () => {
    const items = [
      { id: '1', parentId: null },
      { id: '2', parentId: '1' },
      { id: '3', parentId: '1' },
      { id: '4', parentId: '2' },
      { id: '5', parentId: '2' },
      { id: '6', parentId: '3' },
      { id: '7', parentId: '3' },
    ]

    const result = stratify<ItemType>(items, getId, getParentId, getRootFilterItem)

    expect(result).toHaveProperty('id', '1')
    expect(result?.children).toHaveLength(2)
    expect(result?.children?.[0]).toHaveProperty('id', '2')
    expect(result?.children?.[0]?.children).toHaveLength(2)
    expect(result?.children?.[0]?.children?.[0]).toHaveProperty('id', '4')
    expect(result?.children?.[0]?.children?.[0]).not.toHaveProperty('children')
    expect(result?.children?.[0]?.children?.[1]).toHaveProperty('id', '5')
    expect(result?.children?.[0]?.children?.[1]).not.toHaveProperty('children')
    expect(result?.children?.[1]).toHaveProperty('id', '3')
    expect(result?.children?.[1]?.children).toHaveLength(2)
    expect(result?.children?.[1]?.children?.[0]).toHaveProperty('id', '6')
    expect(result?.children?.[1]?.children?.[0]).not.toHaveProperty('children')
    expect(result?.children?.[1]?.children?.[1]).toHaveProperty('id', '7')
    expect(result?.children?.[1]?.children?.[1]).not.toHaveProperty('children')
  })

  it('should handle circular references by making the item a child of the root item', () => {
    const items1 = [
      { id: '2', parentId: '1' },
      { id: '1', parentId: '2' },
    ]

    const result = stratify<ItemType>(items1, getId, getParentId, getRootFilterItem)

    expect(result).toHaveProperty('id', '0')
    expect(result?.children).toHaveLength(2)
    expect(result?.children?.[0]).toHaveProperty('id', '2')
    expect(result?.children?.[1]).toHaveProperty('id', '1')
  })
})
