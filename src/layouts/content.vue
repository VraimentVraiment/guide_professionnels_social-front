<script setup lang="ts">

const pageContent = useFetchPageContent()

</script>

<template>
  <div>
    <GpsHead
      :title="pageContent?.metatitle ?? ''"
      :description="pageContent?.metadescription ?? ''"
    />
    <GpsHeader />
    <GpsMain>
      <h1
        v-if="pageContent?.title"
      >
        {{ pageContent.title }}
      </h1>
      <!-- eslint-disable-next-line vue/no-v-html vue/max-attributes-per-line-->
      <div v-if="pageContent?.content" v-html="pageContent?.content" />
      <slot />
    </GpsMain>
    <GpsFooter />
  </div>
</template>
