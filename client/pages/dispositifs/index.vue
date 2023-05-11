<script setup lang="ts">

definePageMeta({
  layout: 'filter',
})

const isListSelected = ref(true)

const mounted = ref(false)

const { tabListName, tabTitles } = (await useGetContent('dispositifs'))

const filterStore = inject('filterStore') as FilterStore

const dispositifs = usePostStore<DispositifPost>({
  collectionName: 'fiches_dispositif',
})
dispositifs.update(filterStore.collections)

onMounted(() => {
  watch(filterStore.collections, () => {
    dispositifs.update(filterStore.collections)
  })
  mounted.value = true
})

</script>

<template>
  <GpsGrid>
    <template #top-right>
      <GpsSearchModule />
    </template>
    <template #bottom-left>
      <div
        :class="[
          'gps-sidebar',
        ]"
      >
        <FilterSideBar
          v-if="filterStore.collections?.length"
          :is-list-selected="isListSelected"
          :collections="filterStore.collections"
        />
        <div id="dispositifs-sidebar" />
      </div>
    </template>
    <template #bottom-right>
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
    </template>
  </GpsGrid>
</template>

<style lang="scss">
.gps-sidebar {
  position: relative;

  >*:not(:last-child) {
    margin-bottom: 1rem;
  }
}

.gps-filters-sidebar__content {
  max-height: 50vh;
  overflow-y: auto;
}

#dispositifs-sidebar {
  max-height: 50vh;
  overflow-y: auto;
}

.gps-dispositifs-tabs .fr-tabs__panel {
  max-height: 50vh;
  overflow-y: auto;
}
</style>