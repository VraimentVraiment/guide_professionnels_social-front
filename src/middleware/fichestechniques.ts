export default defineNuxtRouteMiddleware(() => {
  if (process.server) {
    return
  }

  return new Promise<void>((resolve) => {
    const postStore = useFicheTechniquePostStore()
    const promises = []

    if (!postStore.postsCollectionName) {
      postStore.setPostCollection('gps_fichestechniques')
    }
    if (!postStore.collections.some(({ collectionName }) => collectionName === 'gps_fichestechniques')) {
      promises.push(postStore.fetchCollection('gps_fichestechniques'))
    }
    if (!postStore.collections.some(({ collectionName }) => collectionName === 'gps_thematiques')) {
      promises.push(postStore.fetchCollection('gps_thematiques'))
    }

    Promise.allSettled(promises).then(() => {
      postStore.watchPostFiltering()
      resolve()
    })
  })
})
