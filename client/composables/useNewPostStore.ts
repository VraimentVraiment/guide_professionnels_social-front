export const useDispositifPostStore = defineStore('posts', () => {

  const collectionModel = ref(null);
  const postsCollection = ref<Post[]>([])
  const filtersCollections = ref<FiltersCollection[]>([])
  const relationsCollections = ref<DirectusFilter[]>([])
  const rootNodes = computed(() => {
    return filtersCollections.value.map((collection) => {
      return stratifyFilters(collection as FiltersCollection)
    })
  })

  const checkedItems = computed(() => {
    return filtersCollections.value.map((collection) => {
      return {
        collectionName: collection.collectionName,
        items: collection.items.filter(item => item.checked),
      }
    })
  })

  function resetFilters() {
    filtersCollections.value.forEach((c) => {
      c.items.forEach((item) => {
        item.checked = false
      })
    })
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

    const filtersCollection = filtersCollections.value?.find((collection) => {
      return collection.collectionName === collectionName
    })
    if (!filtersCollection) { return }

    const item = filtersCollection.items.find(item => item.id === id)
    if (!item) { return }

    const relationModel = collectionModel.value?.relations?.find((relation) => {
      return relation.collectionName === collectionName
    })

    setItemCheckSideEffects({
      item,
      collection: filtersCollection,
      relationModel,
      value,
      isAltKeyPressed,
    })
    item.checked = value
  }

  const directusFilter = computed(() => {

    return getDirectusFilter({
      relationsModel: collectionModel.value?.relations,
      checkedItems,
      relationsCollections,
      filtersCollections,
    })
  })

  const setCollection = async (collectionName) => {
    const {
      collections: collectionsModel,
    } = (await useGetContent('/collections'))
    collectionModel.value = collectionsModel.find((collection) => {
      return collection.collectionName === collectionName
    })
    // nextTick(async () => {
    //   await fetchFilterCollections()
    //   await fetchRelationsCollections()
    // })
  }

  const fetchPosts = async (): Promise<void> => {
    const posts = await useFetchDirectusItems<Post>({
      collectionName: collectionModel.value?.collectionName,
      params: {
        fields: collectionModel.value?.thumbnailFields ?? '*',
        filter: directusFilter.value,
      },
    })

    if (posts) {
      postsCollection.value = posts
    }
  }

  const fetchFilterCollections = async (): Promise<void> => {

    const filterItems = collectionModel?.value?.relations
      .map(async (relationModel) => {
        return {
          ...relationModel,
          label: relationModel.label,
          items: (
            await useFetchDirectusItems<DirectusFilterItem>({
              collectionName: relationModel.collectionName,
            })
          )
            ?.map((item) => {
              return {
                ...item,
                checked: false,
                collection: relationModel,
              }
            }),
        }
      })

    filtersCollections.value = await Promise.all(filterItems)
  }

  const fetchRelationsCollections = async (): Promise<void> => {
    const relationsItems = collectionModel.value?.relations
      .filter((relationModel) => {
        return relationModel.relationType === 'many-to-many'
      })
      .map(async (relationModel) => {
        return {
          collectionName: relationModel.collectionName as string,
          items: await useFetchDirectusItems<DirectusFilterItem>({
            collectionName: relationModel.junctionCollectionName as string,
            params: { limit: -1 },
          }),
          junctionSourceKey: relationModel.junctionSourceKey,
          junctionTargetKey: relationModel.junctionTargetKey,
        }
      })

    relationsCollections.value = await Promise.all(relationsItems)
  }

  return {
    collectionModel,
    setCollection,
    postsCollection,
    filtersCollections,
    fetchFilterCollections,
    fetchRelationsCollections,
    relationsCollections,
    rootNodes,
    checkedItems,
    directusFilter,
    fetchPosts,
    resetFilters,
    setItem,
  }
})

