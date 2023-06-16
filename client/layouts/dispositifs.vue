<script setup lang="ts">

const collectionsModelStore = useCollectionsModel()
await collectionsModelStore.fetch()

const postStore = useDispositifPostStore()
await postStore.setCollection('gps_fichesdispositif')
await postStore.fetchFiltersCollections()
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