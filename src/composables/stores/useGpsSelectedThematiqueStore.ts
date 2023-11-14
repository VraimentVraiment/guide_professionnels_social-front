export const useGpsSelectedThematiqueStore = defineStore('gpsSelectedThematique', useDefineGpsSelectedThematiqueStore, {
  persist: PERSISTANCE_CONFIG.GPS_SELECTED_THEMATIQUE_STORE,
})

function useDefineGpsSelectedThematiqueStore() {
  const postStore = useDispositifPostStore()

  const thematiquesItems = computed(() => {
    return postStore.filtersCollections
      ?.find((collection) => {
        return collection.collectionName === 'gps_thematiques'
      })
      ?.items
  })

  const selectedThematique = computed(() => {
    return thematiquesItems.value
      ?.find((item) => {
        return item.checked === true
      })
  })

  const typesRootNode = computed(() => {
    return postStore.rootNodes
      ?.find((node) => {
        return node?.data.name === 'gps_typesdispositif'
      })
  })

  return {
    thematiquesItems,
    selectedThematique,
    typesRootNode,
  }
}
