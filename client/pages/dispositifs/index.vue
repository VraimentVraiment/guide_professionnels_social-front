<script setup lang="ts">

definePageMeta({
  layout: 'filter',
})

const isListSelected = ref(true)

const mounted = ref(false)

const { tabListName, tabTitles } = (await useGetContent('dispositifs'))

const filterStore = useFilterStore()

const dispositifsStore = usePostStore()
dispositifsStore.update({
  collectionName: 'fiches_dispositif',
  params: {
    filter: filterStore.directusFilter,
    fields: ['id', 'name', 'addresses'],
  },
})

onMounted(() => {
  watch(filterStore.collections, () => {
    dispositifsStore.update({
      collectionName: 'fiches_dispositif',
      params: {
        filter: filterStore.directusFilter,
      },
    })
  })
  mounted.value = true
})

const { breakpoints } = useDsfrBreakpoints()
const isSmallScreen = breakpoints.smaller('MD')

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
            v-if="mounted"
            to="#dispositifs-sidebar"
            :disabled="isListSelected || isSmallScreen"
          >
            <DispositifCardGrid
              :collection="dispositifsStore.collection"
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