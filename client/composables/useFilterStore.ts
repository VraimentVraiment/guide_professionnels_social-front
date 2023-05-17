import {
  type HierarchyNode,
} from 'd3-hierarchy'

export const useFilterStore = defineStore('filters', () => {

  const collections = reactive<FiltersCollection[]>([])

  const relationCollections = reactive<DirectusFilter[]>([])

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
  ): Promise<void> => {
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
            return directusItemToFilterItem({ item, collection })
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
            targetCollectionName: collection.targetCollectionName as string,
            items: await useFetchDirectusItems<DirectusFilterItem>({
              collectionName: collection.joinCollectionName as string,
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
  ): FilterItemNode[] => {
    return checkedItems?.value?.find((collection) => {
      return collection.name === collectionName
    })?.items as FilterItemNode[]
  }

  const getCollection = (
    collectionName: string,
  ): FiltersCollection => {
    return collections?.find(
      collection => collection.name === collectionName,
    ) as FiltersCollection
  }

  const getCollectionRootNode = (
    collectionName: string,
  ): HierarchyNode<FilterItemNode> | null => {
    return rootNodes.value.find(
      node => node?.data.name === collectionName,
    ) ?? null
  }

  const setItem = ({
    collectionName,
    id,
    value,
    isAltKeyPressed,
  }: {
    collectionName: string,
    id: number
    value: boolean,
    isAltKeyPressed?: boolean,
  }) => {
    const collection = getCollection(collectionName)
    if (!collection) { return }

    const item = collection.items.find(item => item.id === id)
    if (!item) { return }

    item.checked = value
    setItemCheckSideEffects({
      item,
      collection,
      value,
      isAltKeyPressed,
    })
  }

  const directusFilter = computed(() => {

    const filter: DirectusFilter = {}

    const addFilterCondition = (
      condition: Record<string, unknown>,
    ) => {
      filter._and ??= []
      filter._and.push(condition)
    }

    for (const collection of collections) {

      const collectionCheckedItems = getCollectionCheckedItems(collection.name)
      if (collectionCheckedItems?.length === 0) {
        continue;
      }

      if (collection.relationType === 'many-to-one') {
        addFilterCondition({
          [collection.fieldName as string]: {
            "_in": collectionCheckedItems
              .map(item => item.id),
          },
        })
      }

      if (collection.relationType === 'many-to-many') {

        const junction = relationCollections
          .find(j => j.targetCollectionName === collection.name);

        if (!junction) {
          continue;
        }

        const dispositifsIds = getMatchingIds({
          junction,
          checkedItems: collectionCheckedItems,
          collection,
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
    return filter
  })

  return {
    collections,
    rootNodes,
    checkedItems,
    relationCollections,
    directusFilter,
    fetchCollections,
    fetchRelationsCollections,
    getCollection,
    setItem,
    getCollectionRootNode,
  }
})