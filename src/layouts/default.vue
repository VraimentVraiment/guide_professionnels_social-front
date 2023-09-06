<script setup lang="ts">

const publicRuntimeConfig = useRuntimeConfig().public
const {
  siteTitle,
  titleSeparator,
} = publicRuntimeConfig

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
    <Head />
    <GpsHeader />
    <GpsMain>
      <slot />
    </GpsMain>
    <GpsFooter />
  </Html>
</template>
./useGetPageContent
