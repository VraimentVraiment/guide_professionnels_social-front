<script setup lang="ts">

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
    <GpsHeader />
    <GpsMain>
      <NuxtPage />
    </GpsMain>
    <GpsFooter />
  </Html>
</template>
