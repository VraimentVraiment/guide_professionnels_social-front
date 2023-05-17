<script setup lang="ts">

const { filterCollections } = (await useGetContent('/gps'))
const filterStore = useFilterStore()
await filterStore.fetchCollections(filterCollections)
await filterStore.fetchRelationsCollections(filterCollections)

</script>

<template>
  <GpsHeader />
  <GpsMain>
    <GpsHead />
    <slot />
  </GpsMain>
  <GpsFooter />
</template>