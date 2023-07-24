<script setup lang="ts">

const pageContent = useGetPageContent()

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
      <div
        v-if="pageContent?.content"
        v-html="pageContent?.content"
      />
      <slot />
    </GpsMain>
    <GpsFooter />
  </div>
</template>
