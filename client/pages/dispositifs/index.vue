<script setup lang="ts">

definePageMeta({
  layout: 'default',
})

const { filterCollections } = (await useGetContent('/gps')) as { filterCollections: unknown } as { filterCollections: FiltersCollection[] }

const filterStore = useFilterStore(filterCollections)

const dispositifs = usePostStore<DispositifPost>({
  collectionName: 'fiches_dispositif',
})

watchEffect(() => {
  dispositifs.update(filterStore.collections)
})

onMounted(() => {
  filterStore.fetchAll()
})

const { tabListName, tabTitles } = (await useGetContent('dispositifs')) as {
  tabListName: StringConstructor
  tabTitles: { key: string; label: string }[]
}

const tabIndex = useTabIndex()

</script>

<template>
  <div class="gps-sidebar">
    <FilterSideBar
      v-if="filterStore.collections?.length"
      :collections="filterStore.collections"
    />
  </div>
  <GpsSearchModule />
  <GpsTabs
    :class="['gps-dispositifs-tabs']"
    :tab-list-name="tabListName"
    :tab-titles="tabTitles"
    :tab-index="tabIndex"
  >
    <template #tab-0>
      <Teleport
        :disabled="tabIndex.isSelected(0)"
        to="footer"
      >
        <DispositifCardGrid
          :collection="dispositifs.collection.value"
        />
      </Teleport>
    </template>
    <template #tab-1>
      <GpsMap />
    </template>
  </GpsTabs>
</template>

<style scoped lang="scss">
.fr-card__link {
  max-width: 200px !important;
}
</style>
