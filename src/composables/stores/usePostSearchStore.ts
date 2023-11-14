type PostSearchResultInfo = {
  id: number
  name: string
}

export const usePostSearchStore = defineStore('search-post', useDefinePostSearchStore, {
  persist: PERSISTANCE_CONFIG.SEARCH_STORE,
})

function useDefinePostSearchStore() {
  const query = ref<string>('')
  const postItems = ref<PostSearchResultInfo[]>([])

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

    postItems.value = items
  }

  const reset = () => {
    query.value = ''
    postItems.value = []
  }

  return {
    query,
    postItems,
    reset,
    submit,
  }
}
