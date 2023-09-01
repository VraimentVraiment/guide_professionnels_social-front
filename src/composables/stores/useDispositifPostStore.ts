export const useDispositifPostStore = defineStore('posts-fichesdispositif', useDefinePostStore<DispositifPost>, {
  persist: PERSISTANCE_CONFIG.DISPOSITIFS_POST_STORE,
})
