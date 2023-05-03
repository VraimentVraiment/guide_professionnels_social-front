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

const { tabListName, tabTitles } = (await useGetContent('dispositifs'))

const {
    number: index,
    select,
    isSelected,
  } = useNumberObserver()

</script>

<template>
  <div
  class="gps-sidebar"
  >
    <FilterSideBar
      :class="[{ 'open': isSelected(0) }]"
      v-if="filterStore.collections?.length"
      :collections="filterStore.collections"
    />
    <div id="dispositifs-sidebar"></div>
  </div>
  <GpsSearchModule />
  <DsfrTabs
    :class="['gps-dispositifs-tabs']"
    :tab-list-name="tabListName"
    :tab-titles="tabTitles"
    :selected-tab-index="index"
    :initial-selected-index="index"
    @select-tab="select"
  >
    <DsfrTabContent
      :panel-id="`tab-content-${0}`"
      :tab-id="`tab-${0}`"
      :selected="isSelected(0)"
      :asc="isSelected(1)"
    >
      <Teleport
        to="#dispositifs-sidebar"
        :disabled="isSelected(0)"
      >
        <DispositifCardGrid
          :collection="dispositifs.collection.value"
          />
      </Teleport>
    </DsfrTabContent>
    <DsfrTabContent
      :panel-id="`tab-content-${1}`"
      :tab-id="`tab-${1}`"
      :selected="isSelected(1)"
      :asc="isSelected(1)"
    >
      <GpsMap />
    </DsfrTabContent>
  </DsfrTabs>
</template>

<style scoped lang="scss">
.gps-sidebar {
  display: inline-block;
  float: left;
  position: relative;
  max-width: 300px;
  max-width: 30%;
  margin-right: 2rem;
}

#dispositifs-sidebar {
  max-height: 70vh;
  overflow-y: auto;
}

.gps-dispositifs-tabs .fr-tabs__panel {
  max-height: 70vh;
  overflow-y: auto;
}
</style>
