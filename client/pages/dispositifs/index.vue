<script setup lang="ts">

import { useCheckedItemsObserver } from '~/composables/collections/useCheckedItemsObserver'

definePageMeta({
  layout: 'default',
  middleware: [
    'collections-models',
    'fichesdispositif',
  ],
})

const isListSelected = ref(true)
const mounted = ref(false)
const hasMapLoaded = ref(false)

const { breakpoints } = useDsfrBreakpoints()
const isSmallScreen = breakpoints.smaller('MD')

const { tabListName, tabTitles, emptyMessage } = await useGetContent('dispositifs')

const postStore = useDispositifPostStore()
onMounted(() => {
  mounted.value = true
  Promise.all([
    postStore.fetchCollection('gps_caracteristiquesdispositif'),
    postStore.fetchCollection('gps_fichesdispositif'),
  ])
    .then(() => {
      postStore.watchPostFiltering()
    })
})
const searchStore = useSearchStore()

const resetMessageThreshold = 3
const resetLabel = 'Réinitialiser les filtres'
const resetMessage = 'Cette recherche a produit peu de résultats. Vous pouvez réinitialiser les filtres pour élargir la recherche.'

const {
  resetAll,
  hasCheckedItems,
} = useCheckedItemsObserver(computed(() => {
  return postStore.checkedItems
    ?.filter(collectionCheckedItems => collectionCheckedItems.collectionName !== 'gps_thematiques')
}))

const reset = () => {
  resetAll()
  searchStore.reset()
}

const showResetMessage = computed(() => {
  return (
    postStore.postItems.length < resetMessageThreshold &&
    (
      hasCheckedItems.value ||
      searchStore.selectedCityList?.length
    )
  )
})

const getCardProps = (postItem: DispositifPost) => {
  const { name, id, addresses } = postItem
  return {
    title: name,
    description: joinAddresses(addresses),
    link: `/dispositifs/${id}`,
  }
}

</script>

<template>
  <GpsGrid
    show-title
  >
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
          :post-store="postStore"
          :make-unselectable="isListSelected"
          :open-details="['gps_caracteristiquesdispositif']"
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
            <div v-if="showResetMessage">
              <DsfrAlert
                :description="resetMessage"
                :type="'info'"
                small
              />
              <DsfrButton
                :class="'fr-mt-2w fr-mb-3w'"
                :label="resetLabel"
                secondary
                :icon="'ri-close-circle-line'"
                icon-right
                @click="reset"
              />
            </div>
            <template v-if="postStore.postItems.length > 0">
              <p
                v-if="!showResetMessage"
                class="fr-mb-3w"
              >
                {{ postStore.postItems.length }} résultats
              </p>
              <GpsPostCardGrid
                :collection="postStore.postItems"
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
              :collection="postStore.postItems"
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
