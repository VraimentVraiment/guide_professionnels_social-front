<script setup lang="ts">

const content = await queryContent('/components/skip-links').findOne()

const {
  siteTitle,
  titleSeparator,
} = useAppConfig()

const { getMetaTitle } = useGetPageContent()

useHead({
  title: getMetaTitle,
  titleTemplate: (pageTitle) => {
    return [
      pageTitle,
      siteTitle,
    ]
      .filter(Boolean)
      .join(` ${titleSeparator} `)
  },
})

useGpsScheme()

const {
  collectionsModels,
  load: loadModels,
} = useModelsStore()

if (!collectionsModels) {
  await loadModels()
}

</script>

<template>
  <Html lang="fr">
    <DsfrSkipLinks :links="content.links" />
    <GpsHeader id="site-header" />
    <GpsMain id="site-main">
      <ClientOnly>
        <NuxtPage />
      </ClientOnly>
    </GpsMain>
    <GpsFooter id="site-footer" />
  </Html>
</template>
