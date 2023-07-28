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
      <slot />
    </GpsMain>
    <GpsFooter />
  </div>
</template>
