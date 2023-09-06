<script setup lang="ts">

definePageMeta({
  layout: 'default',
})

const pageContent = useFetchPageDirectusContent(useRoute(), ['title', 'content'])

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
