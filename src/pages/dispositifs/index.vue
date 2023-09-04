<script setup lang="ts">
import { useElementBounding } from '@vueuse/core'

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

const content = await queryContent('/pages/dispositifs').findOne()

const postStore = useDispositifPostStore()
onMounted(() => {
  if (process.client) {
    mounted.value = true
  }
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
    postStore.localisedPostItems.length < content.resetMessageThreshold &&
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

const el = ref(null)
const { top } = useElementBounding(el)
const maxHeight = computed(() => {
  const { result } = useScaleLinear({
    domain: [400, 0],
    range: [50, 80],
    value: top,
  })
  return `${result.value}vh`
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
          id="dispositifs-filtersidebar"
          ref="el"
          :post-store="postStore"
          :make-unselectable="isListSelected"
          :open-details="['gps_caracteristiquesdispositif']"
          :max-height="maxHeight"
        />
        <div
          id="dispositifs-sidebar"
          :style="{
            maxHeight,
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
        :tab-list-name="content.tabListName"
        :tab-titles="content.tabTitles"
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
                :description="content.resetMessage"
                :type="'info'"
                small
              />
              <DsfrButton
                :class="'fr-mt-2w fr-mb-3w'"
                :label="content.resetLabel"
                secondary
                :icon="'ri-close-circle-line'"
                icon-right
                @click="reset"
              />
            </div>
            <template v-if="postStore.localisedPostItems.length > 0">
              <p
                v-if="!showResetMessage"
                class="fr-mb-3w"
              >
                {{ postStore.localisedPostItems.length }} résultats
              </p>
              <GpsPostCardGrid
                :collection="postStore.localisedPostItems"
                :wrap-cards="isListSelected"
                :get-card-props="getCardProps"
                type="link"
              />
            </template>
            <template v-else>
              <p>
                {{ content.emptyMessage }}
              </p>
            </template>
          </Teleport>
        </template>
        <template #tab-1>
          <template v-if="!isListSelected || hasMapLoaded">
            <GpsMap
              :collection="postStore.localisedPostItems"
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
    position: relative;

    // position: absolute;
    border-bottom: 1px solid var(--border-default-grey);
    display: none;

    &::after {
      content: '';
      display: none;
      position: absolute;
      z-index: 5;
      height: 2px;
      width: 100%;
      left: 0;
      bottom: 0;
      box-shadow: inset 0 2px 0 0 var(--background-alt-grey);
    }

    @include md {
      &:not(.isListSelected) {
        display: block;

        &::after {
          display: block;
        }
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

.gps-dispositifs-tabs {
  margin-top: 3rem;

  @include md {
    margin-top: 0;
  }
}
</style>
