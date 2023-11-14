export const useLocationSearchStore = defineStore('location-search', useDefineLocationSearchStore, {
  persist: PERSISTANCE_CONFIG.SEARCH_STORE,
})

function useDefineLocationSearchStore() {
  const query = ref<string>('')
  const queryCityList = ref<string[]>([])
  const selectedCityList = ref<string[]>([])

  const add = (cityName: string) => {
    if (!selectedCityList.value.includes(cityName)) {
      selectedCityList.value.push(cityName)
    }
  }

  const remove = (cityName: string) => {
    selectedCityList.value = selectedCityList.value
      .filter((t: string) => t !== cityName)
  }

  const reset = () => {
    query.value = ''
    queryCityList.value = []
    selectedCityList.value = []
  }

  const submit = async() => {
    const content = queryContent('/components/gps-search-bar').findOne()

    const cities = await geocodeCities(query.value, (await content).apiOptions)

    queryCityList.value = cities
      ?.map((city: any) => {
        return city.properties.label
      }) ?? []
  }

  return {
    query,
    queryCityList,
    selectedCityList,
    reset,
    add,
    remove,
    submit,
  }
}
