import { log } from 'console'
import {
  type HierarchyNode,
} from 'd3-hierarchy'

import * as d3 from 'd3-array'

export const useFilterStore = defineStore('filters', () => {

  const collections = reactive<FiltersCollection[]>([])

  const rootNodes = computed(() => {
    return collections.map((collection) => {
      return stratifyFilters(collection as FiltersCollection)
    })
  })

  const checkedItems = computed(() => {
    return collections.map((collection) => {
      return collection.items.filter(item => item.checked)
    })
  })

  const junctionTable = reactive<any[]>([])

  const fetchCollections = async (
    filterCollections: FiltersCollection[],
  ) => {
    if (collections.length) {
      return;
    }
    collections.push(...(await Promise.all(
      filterCollections.map(fetchFilterCollection),
    )))
  }

  const setJunctionTable = ({
    collectionName,
    sourceCollectionName,
    targetCollectionName,
    items,
    primaryKey,
    sourceKey,
    targetKey,
  }) => {
    junctionTable.push({
      collectionName,
      sourceCollectionName,
      targetCollectionName,
      items,
      primaryKey,
      sourceKey,
      targetKey,
    })
  }

  const getCollectionItems = (
    collectionName: string,
  ) => {
    return collections?.find(
      collection => collection.name === collectionName,
    )?.items
  }

  const getCollectionRootNode = (
    collectionName: string,
  ): HierarchyNode<RootFilterItem> | null => {
    return rootNodes.value.find(
      node => node?.data.name === collectionName,
    ) ?? null
  }

  const setItem = ({
    collectionName,
    itemId,
    key,
    value,
  }: {
    collectionName?: string,
    itemId?: number
    key?: keyof FilterItem,
    value?: number | string | boolean,
  }) => {
    console.log('setItem', collectionName, itemId, key, value)
    const collection = collections.find(
      collection => collection.name === collectionName,
    )
    if (!collection) {
      console.error(`setItem: collection ${collectionName} not found in collections`)
      return
    }

    const item = collection.items.find(item => item.id === itemId)

    if (!item) {
      console.error(`setItem: item ${itemId} not found in collection ${collectionName}`)
      return
    } else if (key === 'checked') {
      item.checked = value as boolean
    }
  }

  const directusFilter = computed(() => {

    const filter: DirectusFilter = {}

    for (const collection of collections) {

      const checkedItems = collection.items
        ?.filter(item => item.checked)
        .map(item => item.id)

      console.log('checkedItems', checkedItems)

      if (checkedItems?.length === 0) {
        continue;
      }

      const combination = 'and';

      const junction = junctionTable
        .find(j => j.targetCollectionName === collection.name);

      if (!junction) {
        continue;
      }

      const dispositifsIds = getIdsMatchingFilters({
        checkedItems,
        combination,
        junction,
      })

      if (!dispositifsIds?.length) {
        continue;
      }

      filter._and ??= []
      
      filter._and.push({
        'id': {
          "_in": dispositifsIds,
        },
      })
    }

    console.log('directusFilter', filter)

    return filter
  })

  const getIdsMatchingFilters = ({
    checkedItems,
    combination,
    junction,
  }) => {

    if (combination === 'or') {

      return junction
        ?.items
        ?.reduce((ids, item) => {
          if (
            checkedItems.includes(item[junction.targetKey])
            && !ids.includes(item[junction.sourceKey])
          ) {
            ids.push(item[junction.sourceKey])
          }
          return ids
        }, [])

    } else if (combination === 'and') {

      return Array
        .from(
          d3.group(
            junction.items,
            d => d[junction.sourceKey]),
          ([key, value]) => ({
            [junction.sourceKey]: key,
            [junction.targetKey]: value.map(d => d[junction.targetKey]),
          }),
        )
      .filter((d) => {
        return checkedItems.every((id) => {
          return d[junction.targetKey].includes(id)
        })
      })
      .map(d => d[junction.sourceKey])
    }
  }

  return {
    collections,
    rootNodes,
    checkedItems,
    junctionTable,
    directusFilter,
    setJunctionTable,
    fetchCollections,
    setItem,
    getCollectionItems,
    getCollectionRootNode,
  }
})