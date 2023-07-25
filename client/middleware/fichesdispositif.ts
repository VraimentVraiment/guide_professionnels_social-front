export default defineNuxtRouteMiddleware((to) => {
  if (process.server) {
    return
  }

  const selectedThematiqueStore = useGpsSelectedThematiqueStore()
  if (
    to.path === '/dispositifs' &&
    !selectedThematiqueStore.selectedThematique
  ) {
    return navigateTo('/')
  }

  return new Promise((resolve) => {
    const promises = []

    const postStore = useDispositifPostStore()
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
      .then(() => resolve())
  })
})
