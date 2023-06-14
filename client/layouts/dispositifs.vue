<script setup lang="ts">

const postStore = usePostStore()

await postStore.setCollection('gps_fichesdispositif')
await postStore.fetchFilterCollections()
await postStore.fetchRelationsCollections()

</script>

<template>
  <div>
    <GpsHeader />
    <GpsMain>
      <GpsHead />
      <slot />
    </GpsMain>
    <GpsFooter />
  </div>
</template>