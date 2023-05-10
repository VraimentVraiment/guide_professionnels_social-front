<script setup lang="ts">

definePageMeta({
  layout: 'default',
})

const { filterCollections } = (await useGetContent('/gps')) as { filterCollections: unknown } as { filterCollections: FiltersCollection[] }

const filterStore = useFilterStore(filterCollections)

const dispositifs = usePostStore<DispositifPost>({
  collectionName: 'fiches_dispositif',
})

watch(filterStore.collections, () => {
  dispositifs.update(filterStore.collections)
})

const mounted = ref(false)

onMounted(() => {
  filterStore.fetchAll()
  mounted.value = true
})

const { tabListName, tabTitles } = (await useGetContent('dispositifs'))

const isListSelected = ref(true);

</script>

<template>
  <div
    :class="[
      'fr-grid-row',
      'fr-grid-row--gutters',
    ]"
  >
    <GpsSearchModule 
      :class="[
        'fr-col-12',
        'fr-col-md-8',
        'fr-col-lg-8', 
        'fr-col-xl-8',
        'fr-col-offset-md-4',
      ]"
    />
    <div
      :class="[
        'gps-sidebar',
        'fr-col-12',
        'fr-col-md-4',
        'fr-col-lg-4', 
        'fr-col-xl-4',
      ]"
    >
      <FilterSideBar
        v-if="filterStore.collections?.length"
        :is-list-selected="isListSelected"
        :collections="filterStore.collections"
      />
      <div id="dispositifs-sidebar" />
    </div>
    <div
      :class="[
        'fr-col-12',
        'fr-col-md-8',
        'fr-col-lg-8', 
        'fr-col-xl-8',
      ]"
    >
      <GpsTabs
        :class="[
          'gps-dispositifs-tabs'
        ]"
        :tab-list-name="tabListName"
        :tab-titles="tabTitles"
        @select-tab="index => isListSelected = index === 0"
      >
        <template #tab-0>
          <Teleport
            v-if="mounted"
            to="#dispositifs-sidebar"
            :disabled="isListSelected"
          >
            <DispositifCardGrid :collection="dispositifs.collection.value" />
          </Teleport>
        </template>
        <template #tab-1>
          <GpsMap />
        </template>
      </GpsTabs>
    </div>
  </div>
</template>

<style lang="scss">
.gps-sidebar {
  position: relative;
}

.gps-sidebar {
  max-height: 50vh;
  overflow-y: auto;
}

.gps-dispositifs-tabs .fr-tabs__panel {
  max-height: 50vh;
  overflow-y: auto;
}
</style>