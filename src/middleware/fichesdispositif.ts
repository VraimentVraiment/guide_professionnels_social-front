export default defineNuxtRouteMiddleware(() => {
  if (process.server) {
    return
  }

  return new Promise<void>((resolve) => {
    const postStore = useDispositifPostStore()
    const promises = []

    if (!postStore.postsCollectionName) {
      postStore.setPostCollection('gps_fichesdispositif')
    }
    if (!postStore.collections.some(({ collectionName }) => collectionName === 'gps_thematiques')) {
      promises.push(postStore.fetchCollection('gps_thematiques'))
    }
    if (!postStore.collections.some(({ collectionName }) => collectionName === 'gps_typesdispositif')) {
      promises.push(postStore.fetchCollection('gps_typesdispositif'))
    }

    Promise.allSettled(promises)
      .then(() => {
        resolve()
      })
  })
})
