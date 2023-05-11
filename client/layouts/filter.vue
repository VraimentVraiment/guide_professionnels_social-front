<script setup lang="ts">

const { filterCollections } = (await useGetContent('/gps')) as { filterCollections: unknown } as { filterCollections: FiltersCollection[] }

const filterStore = useFilterStore(filterCollections)

await filterStore.fetchAll()

provide('filterStore', filterStore)

</script>

<template>
  <GpsHeader />
  <GpsMain>
    <GpsHead />
    <slot />
  </GpsMain>
  <GpsFooter />
</template>