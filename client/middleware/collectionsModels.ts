export default defineNuxtRouteMiddleware(() => {
  const collectionsModelsStore = useCollectionsModelsStore()

  if (process.server) {
    return
  }

  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    if (!collectionsModelsStore.collectionsModels.length) {
      await collectionsModelsStore.fetch()
    }
    resolve()
  })
})
