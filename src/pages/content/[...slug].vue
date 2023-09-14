<script setup lang="ts">

definePageMeta({
  layout: 'default',
  validate: async(route) => {
    const slug = route.params?.slug?.[0]
    if (!slug) {
      return false
    }

    const key = `page-content-${String(route.name)}-${route.params?.slug?.[0]}`

    let directusPageContent = useState(key)

    if (!directusPageContent.value) {
      const isAuthenticated = await useIsAuthenticated()
      const status = (
        isAuthenticated.value
          ? ['published-public', 'published-private']
          : ['published-public']
        )as GpsPageStatus[]
      const content = await useFetchDirectusPageItem({
        pageName: slug as string,
        status,
        fields: ['title', 'metatitle', 'metadescription', 'content'],
      })

      directusPageContent = useState(key, () => content)
    }

    return Boolean(directusPageContent.value)
  },
})

const route = useRoute()
const key = `page-content-${String(route.name)}-${route.params?.slug?.[0]}`
const pageContent = useState(key)

</script>

<template>
  <div>
    <h1 v-if="pageContent?.title">
      {{ pageContent.title }}
    </h1>
    <!-- eslint-disable-next-line vue/no-v-html vue/max-attributes-per-line-->
    <div v-if="pageContent?.content" v-html="pageContent?.content" />
  </div>
</template>
