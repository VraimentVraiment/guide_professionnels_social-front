<script setup lang="ts">

definePageMeta({
  layout: 'dispositifs',
})

const isListSelected = ref(true)
const mounted = ref(false)
const hasMapLoaded = ref(false)
const { breakpoints } = useDsfrBreakpoints()
const isSmallScreen = breakpoints.smaller('MD')

const { tabListName, tabTitles, emptyMessage } = (await useGetContent('dispositifs'))

const postStore = useDispositifPostStore()

onMounted(async () => {
  await postStore.fetchPostsCollection()
  watch(
    postStore.filtersCollections,
    () => {
      if (!postStore.cancelWatch) {
        postStore.fetchFiltersCollections()
        nextTick(() => {
          postStore.fetchPostsCollection()
        })
      }
    })
  mounted.value = true
})

const getCardProps = (postItem) => {
  const { name, id, addresses } = postItem
  return {
    title: name,
    description: joinAddresses(addresses),
    link: `/dispositifs/${id}`,
  }
}

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
          :make-unselectable="isListSelected"
          :filter-collections="postStore.filtersCollections"
          :root-nodes="postStore.rootNodes"
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
        @select-tab="(index: number) => isListSelected = index === 0"
      >
        <template #tab-0>
          <Teleport
            v-if="mounted"
            to="#dispositifs-sidebar"
            :disabled="isListSelected || isSmallScreen"
          >
            <template v-if="postStore.postsCollection.length > 0">
              <GpsPostCardGrid
                :collection="postStore.postsCollection"
                :wrap-cards="isListSelected"
                :get-card-props="getCardProps"
                type="link"
              />
            </template>
            <template v-else>
              <p>
                {{ emptyMessage }}
              </p>
            </template>
          </Teleport>
        </template>
        <template #tab-1>
          <template v-if="!isListSelected || hasMapLoaded">
            <GpsMap
              :collection="postStore.postsCollection"
              @map-loaded="() => hasMapLoaded = true"
            />
          </template>
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