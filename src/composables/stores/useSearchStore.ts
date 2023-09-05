import { watchDebounced } from '@vueuse/core'

type PostSearchResultInfo = {
  id: number
  name: string
}

export const useSearchStore = defineStore('search', useDefineSearchStore, {
  persist: PERSISTANCE_CONFIG.SEARCH_STORE,
})

function useDefineSearchStore() {
  const query = ref<string>('')
  const openModal = ref<Boolean>(false)
  const queryCityList = ref<string[]>([])
  const selectedCityList = ref<string[]>([])
  const postItems = ref<PostSearchResultInfo[]>([])

  const add = (cityName: string) => {
    if (!selectedCityList.value.includes(cityName)) {
      selectedCityList.value.push(cityName)
    }
  }

  const remove = (cityName: string) => {
    selectedCityList.value = selectedCityList.value
      .filter((t: string) => t !== cityName)
  }

  const submit = async() => {
    /**
     * @todo use collection model
     */
    const params = {
      search: query.value,
      fields: ['id', 'name'],
      filter: {
        status: {
          _eq: 'published',
        },
      },
    }

    const items = await useFetchDirectusItems<PostSearchResultInfo>({
      collectionName: 'gps_fichesdispositif',
      params,
    })

    openModal.value ||= true

    postItems.value = items
  }

  const reset = () => {
    query.value = ''
    queryCityList.value = []
    selectedCityList.value = []
    postItems.value = []
  }

  const watchQuery = () => {
    const content = queryContent('/components/gps-search-bar').findOne()

    watchDebounced(query, async() => {
      const cities = await geocodeCities(query.value, (await content).apiOptions)

      queryCityList.value = cities
        ?.map((city: any) => {
          return city.properties.label
        }) ?? []

      if (queryCityList.value.length) {
        openModal.value ||= true
      }
    }, { debounce: 500, maxWait: 1000 })
  }

  return {
    query,
    queryCityList,
    selectedCityList,
    postItems,
    openModal,
    reset,
    add,
    remove,
    submit,
    watchQuery,
  }
}
