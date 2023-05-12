<script setup lang="ts">

const { filterCollections } = (await useGetContent('/gps')) as { filterCollections: unknown } as { filterCollections: FiltersCollection[] }

const filterStore = useFilterStore()
await filterStore.fetchCollections(filterCollections)
const junctionTable = await useFetchDirectusItems<DirectusFilterItem>({
  collectionName: 'dispositifs-caracteristiques-m2m',
  params: {
    limit: -1,
  },
})
filterStore.setJunctionTable({
  collectionName: 'dispositifs-caracteristiques-m2m',
  sourceCollectionName: 'fiches_dispositif',
  targetCollectionName: 'caracteristiques_dispositif',
  items: junctionTable,
  primaryKey: 'id',
  sourceKey: 'dispositif_id',
  targetKey: 'caracteristique_dispositif_id',
})

</script>

<template>
  <GpsHeader />
  <GpsMain>
    <GpsHead />
    <slot />
  </GpsMain>
  <GpsFooter />
</template>