<script setup lang="ts">

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

const {
  resetMessageThreshold,
  resetLabel,
  resetMessage,
  emptyMessage,
  tabListName,
  tabTitles,
} = await useGetContent('dispositifs')

const postStore = useDispositifPostStore()
onMounted(() => {
  mounted.value = true
  Promise.allSettled([
    postStore.fetchCollection('gps_caracteristiquesdispositif'),
    postStore.fetchCollection('gps_fichesdispositif'),
  ])
    .then(() => {
      postStore.watchPostFiltering()
    })
})

const searchStore = useSearchStore()

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

const { maxHeight } = useMaxHeight({
  domain: [0, 400],
  range: [40, 80],
})

</script>

<template>
  <GpsGrid show-title>
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
          :max-height="maxHeight"
        />
        <div
          id="dispositifs-sidebar"
          :style="{
            maxHeight: maxHeight,
          }"
          :class="[{
            isListSelected
          }]"
        />
      </div>
    </template>
    <template #bottom-right>
      <GpsTabs
        :class="[
          'gps-dispositifs-tabs'
        ]"
        :tab-list-name="tabListName"
        :tab-titles="tabTitles"
        :max-height="maxHeight"
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
@import "@/styles/";

.gps-sidebar {
  position: relative;
  margin-top: 4px;

  #dispositifs-sidebar {
    overflow-y: auto;
    width: 100%;
    top: 2.75rem;
    padding-top: 1.5rem;
    position: absolute;
    border-bottom: 1px solid var(--border-default-grey);

    &::after {
      content: '';
      display: block;
      position: absolute;
      z-index: 10;
      height: 2px;
      width: 100%;
      left: 0;
      bottom: 0;
      box-shadow: inset 0 2px 0 0 var(--background-alt-grey);
    }

      display: none;

      &::after {
        display: none;
      }

    @include sm {
      display: block;

      &::after {
        display: block;
      }
    }

    &.isListSelected {
      display: none;
    }

    >*:not(:last-child) {
      margin-bottom: 1rem;
    }
  }
}
</style>
