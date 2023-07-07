export default defineNuxtRouteMiddleware(() => {
  if (process.server) {
    return
  }

  const postStore = useFicheTechniquePostStore()

  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    if (!postStore.postsCollectionName) {
      postStore.setPostCollection('gps_fichestechniques')
      await postStore.fetchCollection('gps_fichestechniques')
      await postStore.fetchCollection('gps_thematiques')
      postStore.watchPostFiltering()
    }
    resolve()
  })
})
