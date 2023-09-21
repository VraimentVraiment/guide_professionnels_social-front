/**
 * Collections models middleware
 */
export default defineNuxtRouteMiddleware(async() => {
  const {
    collectionsModels,
    load,
  } = useModelsStore()

  if (!collectionsModels) {
    await load()
  }
})
