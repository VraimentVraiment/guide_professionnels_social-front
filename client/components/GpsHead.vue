<script lang="ts" setup>

const props = defineProps<{
  pageContent?: {
    title?: string
    metaTitle?: string
    metaDescription?: string
  }
}>()

const route = useRoute()

const pageContent = reactive({})

watchEffect(async () => {
  const content =
    props.pageContent ??
    await useGetPageContent(route.name as string) ??
    {}
  Object.assign(pageContent, content)
})

</script>

<template>
  <Html lang="fr">
    <Head>
      <Title>{{ pageContent.metaTitle ?? '' }}</Title>
      <Meta
        v-if="pageContent.metaDescription"
        name="description"
        :content="pageContent.metaDescription"
      />
    </Head>
  </Html>
  <PageTitle :title="pageContent.title ?? ''" />
</template>
