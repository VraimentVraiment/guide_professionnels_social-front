<script setup lang="ts">

const route = useRoute()

const slug = route.params?.slug?.[0]
if (!slug) {
  navigateTo('/404')
}

const isAuthenticated = useIsAuthenticated()

const status = (
  isAuthenticated.value
    ? ['published-public', 'published-private']
    : ['published-public']
) as GpsPageStatus[]

const pageContent = await useFetchDirectusPageItem({
  pageName: slug as string,
  status,
  fields: ['title', 'metatitle', 'metadescription', 'content'],
})

if (!pageContent) {
  navigateTo('/404')
}

</script>

<template>
  <div>
    <h1 v-if="pageContent?.title">
      {{ pageContent.title }}
    </h1>
    <div v-dompurify-html="pageContent?.content ?? ''" />
  </div>
</template>
