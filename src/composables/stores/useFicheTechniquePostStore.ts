export const useFicheTechniquePostStore = defineStore('posts-fichestechniques', useDefinePostStore<FicheTechniquePost>, {
  persist: PERSISTANCE_CONFIG.FICHE_TECHNIQUE_POST_STORE,
})
