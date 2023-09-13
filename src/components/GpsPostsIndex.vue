<script setup lang="ts" generic="PostType extends GpsPost">

import { useElementBounding } from '@vueuse/core'
import { DsfrCard, DsfrFileDownload } from '@gouvminint/vue-dsfr'
import { storeToRefs } from 'pinia'

const props = defineProps<{
  postStore: ReturnType<typeof useDispositifPostStore | typeof useFicheTechniquePostStore>
  doUseSearchStore?: boolean
  doUseMap?: boolean
  id: string
  openDetails: string[]
  cardType: 'link' | 'file'
  getCardProps:(postItem: PostType) => typeof DsfrCard | typeof DsfrFileDownload
}>()

const isPostsTabSelected = ref(true)
const mounted = ref(false)
const hasMapLoaded = ref(false)

const { breakpoints } = useDsfrBreakpoints()
const isSmallScreen = breakpoints.smaller('MD')

const content = await queryContent('/components/posts-index').findOne()

await props.postStore.fetchInitialCollections()
onMounted(() => {
  if (process.client) {
    mounted.value = true
  }
  props.postStore.watchPostFiltering()
})

const searchStore = props.doUseSearchStore ? useSearchStore() : null
const { resetableCheckedItems } = storeToRefs(props.postStore)
const {
  resetAll,
  hasCheckedItems,
} = useCheckedItemsObserver(resetableCheckedItems)
const reset = () => {
  resetAll()
  searchStore?.reset()
}

const showResetMessage = computed(() => {
  return (
    props.postStore.localisedPostItems?.length < content.resetMessageThreshold &&
    (
      hasCheckedItems.value ||
      (
        props.doUseSearchStore &&
        searchStore?.selectedCityList?.length
      )
    )
  )
})

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

const tabTitles = content.tabTitles
  .filter((item: TabTitle) => {
    return props.doUseMap || item.type !== 'map'
  })
</script>

<template>
  <GpsGrid>
    <template #top-left>
      <GpsPageTitle />
    </template>
    <template #top-right>
      <GpsSearchModule v-if="doUseSearchStore" />
    </template>
    <template #bottom-left>
      <div
        :class="[
          'gps-sidebar',
        ]"
      >
        <GpsFilterSideBar
          :id="`${id}-filtersidebar`"
          ref="el"
          :post-store="postStore"
          :make-unselectable="isPostsTabSelected"
          :open-details="openDetails"
          :max-height="maxHeight"
        />
        <div
          :id="`${id}-sidebar`"
          :style="{
            maxHeight,
          }"
          :class="[
            'fr-pt-md-6v',
            { 'is-posts-tab-selected': isPostsTabSelected }
          ]"
        />
      </div>
    </template>
    <template #bottom-right>
      <GpsTabs
        :class="[
          'gps-posts-tabs'
        ]"
        :tab-list-name="'test'"
        :tab-titles="tabTitles"
        :max-height="maxHeight"
        @select-tab="(index: number) => isPostsTabSelected = index === 0"
      >
        <template #tab-0>
          <Teleport
            v-if="mounted"
            :to="`#${id}-sidebar`"
            :disabled="isPostsTabSelected || isSmallScreen"
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
            <template v-if="postStore.localisedPostItems?.length > 0">
              <p
                v-if="!showResetMessage"
                class="fr-mb-3w"
              >
                {{ postStore.localisedPostItems.length }} résultats
              </p>
              <GpsPostCardGrid
                :collection="postStore.localisedPostItems"
                :wrap-cards="isPostsTabSelected"
                :get-card-props="getCardProps"
                :type="cardType"
              />
            </template>
            <template v-else>
              <p>
                {{ content.emptyMessage }}
              </p>
            </template>
          </Teleport>
        </template>
        <template
          v-if="doUseMap"
          #tab-1
        >
          <template v-if="!isPostsTabSelected || hasMapLoaded">
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
.gps-sidebar {
  position: relative;
  margin-top: 4px;

  #dispositifs-sidebar {
    overflow-y: auto;
    width: 100%;
    top: 2.75rem;
    position: relative;
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

    @include dsfr.md {
      &:not(.is-posts-tab-selected) {
        display: block;

        &::after {
          display: block;
        }
      }
    }

    &.is-posts-tab-selected {
      display: none;
    }

    >*:not(:last-child) {
      margin-bottom: 1rem;
    }
  }
}

.gps-posts-tabs {
  margin-top: 3rem;

  @include dsfr.md {
    margin-top: 0;
  }
}
</style>
