export default defineNuxtRouteMiddleware(() => {
  if (process.server) {
    return
  }

  const postStore = useFicheTechniquePostStore()

  return new Promise((resolve) => {
    if (!postStore.postsCollectionName) {
      postStore.setPostCollection('gps_fichestechniques')
      Promise.allSettled([
        postStore.fetchCollection('gps_fichestechniques'),
        postStore.fetchCollection('gps_thematiques'),
      ]).then(() => {
        postStore.watchPostFiltering()
        resolve()
      })
    } else {
      resolve()
    }
  })
})
