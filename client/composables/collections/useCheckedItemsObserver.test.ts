import { describe, it, expect } from 'vitest'
import { reactive } from 'vue'
import { useCheckedItemsObserver } from './useCheckedItemsObserver'

describe('useCheckedItemsObserver', () => {
  // it('should set all items to unchecked when resetCheckedItems is called', () => {
  //   const collection = reactive({
  //     items: [
  //       { id: 1, checked: true },
  //       { id: 2, checked: true },
  //       { id: 3, checked: true },
  //     ],
  //   })

  //   const checkedItems = reactive([
  //     {
  //       collectionName: 'myCollection',
  //       items: [collection],
  //     },
  //   ])

  //   useCheckedItemsObserver(checkedItems)

  //   expect(collection.items.every(item => !item.checked)).toBe(true)
  // })

  // it('should return true if there are checked items', () => {
  //   const collection = reactive({
  //     items: [
  //       { id: 1, checked: false },
  //       { id: 2, checked: true },
  //       { id: 3, checked: false },
  //     ],
  //   })

  //   const checkedItems = reactive([
  //     {
  //       collectionName: 'myCollection',
  //       items: [collection],
  //     },
  //   ])

  //   const { hasCheckedItems } = useCheckedItemsObserver(checkedItems)

  //   expect(hasCheckedItems.value).toBe(true)
  // })

  // it('should return false if there are no checked items', () => {
  //   const collection = reactive({
  //     items: [
  //       { id: 1, checked: false },
  //       { id: 2, checked: false },
  //       { id: 3, checked: false },
  //     ],
  //   })

  //   const checkedItems = reactive([
  //     {
  //       collectionName: 'myCollection',
  //       items: [collection],
  //     },
  //   ])

  //   const { hasCheckedItems } = useCheckedItemsObserver(checkedItems)

  //   expect(hasCheckedItems.value).toBe(false)
  // })

  // it('should return true if there are checked items in the specified collection', () => {
  //   const collection1 = reactive({
  //     items: [
  //       { id: 1, checked: false },
  //       { id: 2, checked: false },
  //       { id: 3, checked: false },
  //     ],
  //   })

  //   const collection2 = reactive({
  //     items: [
  //       { id: 4, checked: false },
  //       { id: 5, checked: true },
  //       { id: 6, checked: false },
  //     ],
  //   })

  //   const checkedItems = reactive([
  //     {
  //       collectionName: 'collection1',
  //       items: [collection1],
  //     },
  //     {
  //       collectionName: 'collection2',
  //       items: [collection2],
  //     },
  //   ])

  //   const { hasCollectionCheckedItems } = useCheckedItemsObserver(checkedItems)

  //   expect(hasCollectionCheckedItems('collection1')).toBe(false)
  //   expect(hasCollectionCheckedItems('collection2')).toBe(true)
  // })

  // it('should return false if there are no checked items in the specified collection', () => {
  //   const collection1 = reactive({
  //     items: [
  //       { id: 1, checked: false },
  //       { id: 2, checked: false },
  //       { id: 3, checked: false },
  //     ],
  //   })

  //   const collection2 = reactive({
  //     items: [
  //       { id: 4, checked: false },
  //       { id: 5, checked: false },
  //       { id: 6, checked: false },
  //     ],
  //   })

  //   const checkedItems = reactive([
  //     {
  //       collectionName: 'collection1',
  //       items: [collection1],
  //     },
  //     {
  //       collectionName: 'collection2',
  //       items: [collection2],
  //     },
  //   ])

  //   const { hasCollectionCheckedItems } = useCheckedItemsObserver(checkedItems)

  //   expect(hasCollectionCheckedItems('collection1')).toBe(false)
  //   expect(hasCollectionCheckedItems('collection2')).toBe(false)
  // })
})
