import {
  type HierarchyNode,
} from 'd3-hierarchy'

import * as d3 from 'd3-array'

export const useFilterStore = defineStore('filters', () => {

  const collections = reactive<FiltersCollection[]>([])
  const relationCollections = reactive<any[]>([])

  const rootNodes = computed(() => {
    return collections.map((collection) => {
      return stratifyFilters(collection as FiltersCollection)
    })
  })

  const checkedItems = computed(() => {
    return collections.map((collection) => {
      return {
        name: collection.name,
        items: collection.items.filter(item => item.checked),
      }
    })
  })

  const fetchCollections = async (
    filterCollections: FiltersCollection[],
  ) => {
    if (collections.length) {
      return;
    }
    collections.push(...(await Promise.all(
      filterCollections.map(async (
        collection: FiltersCollection,
      ) => {
        const items = (
          await useFetchDirectusItems<DirectusFilterItem>({
            collectionName: collection.name,
          })
        )
          .map((item) => {
            return directusItemToFilterItem(item, collection.name, collection)
          })

        return {
          ...collection,
          items,
        }
      }),
    )))
  }

  const fetchRelationsCollections = async (
    filterCollections: FiltersCollection[],
  ) => {

    if (relationCollections.length) {
      return;
    }

    relationCollections.push(...(await Promise.all(
      filterCollections
        .filter(collection => collection.relationType === 'many-to-many')
        .map(async (collection) => {
          return {
            targetCollectionName: collection.targetCollectionName,
            items: await useFetchDirectusItems<DirectusFilterItem>({
              collectionName: collection.joinCollectionName,
              params: { limit: -1 },
            }),
            primaryKey: collection.primaryKey,
            sourceKey: collection.sourceKey,
            targetKey: collection.targetKey,
          }
        }),
    )))
  }

  const getCollectionCheckedItems = (
    collectionName: string,
  ) => {
    return checkedItems?.value?.find((collection) => {
      return collection.name === collectionName
    })?.items
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
    console.log("collection :", collection);
    if (collection) {
      const item = collection.items.find(item => item.id === itemId)
      if (collection.userSelection === 'single-node') {
        collection.items.forEach(item => item.checked = false)
      } else if (collection.userSelection === 'all-nodes') {
        nextTick(() => {
          setItemChildren(collection, item, value as boolean)
          setItemParent(collection, item, value as boolean)
        })
      }
      if (item) {
        item.checked = value as boolean
      }
    }
  }

  const directusFilter = computed(() => {

    const filter: DirectusFilter = {}

    const addFilterCondition = (condition) => {
      filter._and ??= []
      filter._and.push(condition)
    }

    for (const collection of collections) {

      const collectionCheckedItems = getCollectionCheckedItems(collection.name)
        .map(item => item.id)

      if (collectionCheckedItems?.length === 0) {
        continue;
      }

      if (collection.relationType === 'many-to-one') {
        addFilterCondition({
          [collection.fieldName]: {
            "_in": collectionCheckedItems,
          },
        })
      }
      if (collection.relationType === 'many-to-many') {

        const combination = 'and';
        const junction = relationCollections
          .find(j => j.targetCollectionName === collection.name);
        if (!junction) {
          continue;
        }

        const dispositifsIds = getIdsMatchingFilters({
          collectionCheckedItems,
          combination,
          junction,
        })

        if (!dispositifsIds?.length) {
          continue;
        }

        addFilterCondition({
          'id': {
            "_in": dispositifsIds,
          },
        })
      }
    }

    console.log('directusFilter', filter)

    return filter
  })

  const getIdsMatchingFilters = ({
    collectionCheckedItems,
    junction,
    combination,
  }) => {

    if (combination === 'or') {

      return getOrItems(junction, collectionCheckedItems)

    } else if (combination === 'and') {

      return getAndItems(junction, collectionCheckedItems)
    }
  }

  return {
    collections,
    rootNodes,
    checkedItems,
    relationCollections,
    directusFilter,
    fetchCollections,
    fetchRelationsCollections,
    setItem,
    getCollectionItems,
    getCollectionRootNode,
  }
})

function getOrItems(
  junction: any,
  collectionCheckedItems: FilterItem[],
) {
  return junction?.items
    ?.reduce((ids, item) => {
      if (
        collectionCheckedItems.includes(item[junction.targetKey])
        && !ids.includes(item[junction.sourceKey])
      ) {
        ids.push(item[junction.sourceKey])
      }
      return ids
    }, [])
}

function getAndItems(
  junction: any,
  collectionCheckedItems: FilterItem[],
) {

  const groups = d3.group(
    junction.items,
    d => d[junction.sourceKey],
  )

  return Array
    .from(groups, ([key, value]) => ({
      [junction.sourceKey]: key,
      [junction.targetKey]: value.map(d => d[junction.targetKey]),
    }),
    )
    .filter((d) => {
      return collectionCheckedItems.every((id) => {
        return d[junction.targetKey].includes(id)
      })
    })
    .map(d => d[junction.sourceKey])
}

const setItemParent = (
  collection: FiltersCollection,
  item: FilterItem,
  value: boolean,
) => {
  const parent = collection.items
    .find(i => i.id === item.parent_id)

  const siblings = collection.items
    .filter(i => i.parent_id === item.parent_id)
    
  if (
    value === true
    && parent?.checked === false
  ) {
    parent.checked = true
    setItemParent(collection, parent, value)
  }

  if (parent && siblings?.length) {

    const allSiblingsUnchecked = siblings
      .every(sibling => !sibling.checked)

    if (
      allSiblingsUnchecked
      && parent?.checked === true
    ) {
      parent.checked = false
      setItemParent(collection, parent, value)
    }
  }
}

const setItemChildren = (
  collection: FiltersCollection,
  item: FilterItem,
  value: boolean,
) => {
  const children = collection.items.filter(i => i.parent_id === item.id)
  children.forEach((child) => {
    child.checked = value
    setItemChildren(collection, child, value)
  })
}