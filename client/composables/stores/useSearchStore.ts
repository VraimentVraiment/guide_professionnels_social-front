import { watchDebounced } from '@vueuse/core'

type PostSearchResultInfo = {
  id: number
  name: string
}

export const useSearchStore = defineStore('search', useDefineSearchStore, {
  // persist: true,
})

function useDefineSearchStore () {
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
    selectedCityList.value = selectedCityList.value.filter((t: string) => t !== cityName)
  }

  const submit = async () => {
    const items = await useFetchDirectusItems<PostSearchResultInfo>({
      collectionName: 'gps_fichesdispositif',
      params: {
        search: query.value,
        fields: ['id', 'name'],
      },
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
    watchEffect(() => {
      if (
        queryCityList.value.length > 0 ||
        postItems.value.length > 0
      ) {
        openModal.value = true
      } else {
        openModal.value = false
      }
    })

    watchDebounced(query, async () => {
      const cities = await getCities(query.value)
      queryCityList.value = cities
        ?.map((city: any) => {
          return city.properties.label
        }) ?? []
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
