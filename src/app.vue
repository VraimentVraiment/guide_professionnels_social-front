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

</script>

<template>
  <Html lang="fr">
    <DsfrSkipLinks
      :links="content.links"
    />
    <GpsHeader id="site-header" />
    <DsfrScheme />
    <GpsMain id="site-main">
      <NuxtPage />
    </GpsMain>
    <GpsFooter id="site-footer" />
  </Html>
</template>
