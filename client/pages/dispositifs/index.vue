<script setup lang="ts">

definePageMeta({
  layout: 'filter',
})

const { tabListName, tabTitles } = (await useGetContent('dispositifs'))

const { breakpoints } = useDsfrBreakpoints()
const isSmallScreen = breakpoints.smaller('MD')
const isListSelected = ref(true)

const filterStore = useFilterStore()
const dispositifs = usePostStore<DispositifPost>({
  collectionName: 'fiches_dispositif',
})
dispositifs.update(filterStore.directusFilter)
// onMounted(() => {
  watch(filterStore.collections, () => {
    dispositifs.update(filterStore.directusFilter)
  })
// })

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
          :collections="filterStore.collections as FiltersCollection[]"
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
            to="#dispositifs-sidebar"
            :disabled="isListSelected || isSmallScreen"
          >
            <DispositifCardGrid
              :collection="dispositifs.collection.value"
              :is-list-selected="isListSelected"
            />
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

  #dispositifs-sidebar {
    overflow-y: auto;
    width: 100%;
    padding-top: 4rem;
    max-height: calc(50vh + 8rem);
  }

  >*:not(:last-child) {
    margin-bottom: 1rem;
  }
}

.gps-filters-sidebar__content {
  max-height: 50vh;
  overflow-y: auto;
}

.gps-dispositifs-tabs .fr-tabs__panel {
  max-height: 50vh;
  margin-top: 2px;
  overflow-y: auto;
}
</style>