import { expect } from 'vitest'

const sourceKey = 'postId'
const targetKey = 'tagId'

describe('getIdsMatchingEvery', () => {
  const relationGroups = [
    {
      sourceKey: 'postId',
      targetKey: 'tagId',
      groups: [
        { postId: 1, tagId: [1] },
        { postId: 2, tagId: [1, 2] },
        { postId: 3, tagId: [2] },
        { postId: 4, tagId: [1, 2] },
        { postId: 5, tagId: [1, 2, 3] },
      ],
    },
  ]

  it('returns every sourceIds when no target ids is given', () => {
    const targetIds = [] as number[]
    const result = getIdsMatchingEvery(targetIds, relationGroups, sourceKey, targetKey)
    expect(result).toEqual([1, 2, 3, 4, 5])
  })

  it('returns an array of sourceIds matching every targetIds', () => {
    const targetIds = [1, 2]
    const result = getIdsMatchingEvery(targetIds, relationGroups, sourceKey, targetKey)
    expect(result).toEqual([2, 4, 5])
  })

  it('returns an empty array when there are no matching sourceIds', () => {
    const targetIds = [4, 5] as number[]
    const result = getIdsMatchingEvery(targetIds, relationGroups, sourceKey, targetKey)
    expect(result).toEqual([])
  })
})

describe('getIdsMatchingAtLeast', () => {
  const relationItems = [
    {
      id: 1,
      postId: 1,
      tagId: 2,
    },
    {
      id: 2,
      postId: 2,
      tagId: 2,
    },
    {
      id: 3,
      postId: 3,
      tagId: 2,
    },
  ]

  it('returns every sourceIds when no target ids is given', () => {
    const targetIds = [] as number[]
    const result = getIdsMatchingAtLeast(targetIds, relationItems, sourceKey, targetKey)
    expect(result).toEqual([1, 2, 3])
  })

  it('returns an array of sourceIds matching at least targetIds', () => {
    const targetIds = [2]
    const result = getIdsMatchingAtLeast(targetIds, relationItems, sourceKey, targetKey)
    expect(result).toEqual([1, 2, 3])
  })

  it('returns an empty array when there are no matching sourceIds', () => {
    const targetIds = [4, 5] as number[]
    const result = getIdsMatchingAtLeast(targetIds, relationItems, sourceKey, targetKey)
    expect(result).toEqual([])
  })
})
