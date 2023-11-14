<script setup lang="ts" generic="PostType extends GpsPost">

import { useElementBounding } from '@vueuse/core'
import { DsfrCard, DsfrFileDownload } from '@gouvminint/vue-dsfr'

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
const {
  resetableCheckedItems,
  localisedPostItems: postsItems,
} = storeToRefs(props.postStore)

const checkedItemsObserver = useCheckedItemsObserver(resetableCheckedItems)

const searchStore = props.doUseSearchStore ? useSearchStore() : null

const reset = () => {
  checkedItemsObserver.resetAll()
  searchStore?.reset()
}

const showResetMessage = computed(() => {
  return (
    postsItems.value?.length < content.resetMessageThreshold &&
    (
      checkedItemsObserver.hasCheckedItems.value ||
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
          'gps-posts__sidebar',
        ]"
      >
        <GpsFilterSideBar
          :id="`${id}-posts__sidebar__filters`"
          ref="el"
          :post-store="postStore"
          :make-unselectable="isPostsTabSelected"
          :open-details="openDetails"
          :max-height="maxHeight"
          :checked-items-observer="checkedItemsObserver"
        />
        <div
          :id="`${id}-posts__sidebar__posts`"
          :style="{
            maxHeight,
          }"
          :class="[
            'gps-posts__sidebar__posts',
            'fr-pt-md-6v',
            { 'is-posts-tab-selected': isPostsTabSelected }
          ]"
        />
      </div>
    </template>
    <template #bottom-right>
      <GpsTabs
        :class="[
          'gps-posts__tabs'
        ]"
        :tab-list-name="content.tabListName"
        :tab-titles="tabTitles"
        :max-height="maxHeight"
        @select-tab="(index: number) => isPostsTabSelected = index === 0"
      >
        <template #tab-0>
          <Teleport
            v-if="mounted"
            :to="`#${id}-posts__sidebar__posts`"
            :disabled="isPostsTabSelected || isSmallScreen"
          >
            <div
              :class="[
                'gps-posts__posts-container',
              ]"
            >
              <div v-if="showResetMessage">
                <DsfrAlert
                  :description="content.resetMessage"
                  :type="'info'"
                  small
                />
                <DsfrButton
                  :class="[
                    'fr-mt-2w',
                    'fr-mb-3w'
                  ]"
                  :label="content.resetLabel"
                  :icon="'ri-close-circle-line'"
                  secondary
                  icon-right
                  @click="reset"
                />
              </div>
              <template v-if="postsItems?.length > 0">
                <p
                  v-if="!showResetMessage"
                  :class="[
                    'fr-mb-3w'
                  ]"
                >
                  {{ postsItems.length }} résultats
                </p>
                <GpsPostCardGrid
                  :collection="postsItems"
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
            </div>
          </Teleport>
        </template>
        <template
          v-if="doUseMap && (!isPostsTabSelected || hasMapLoaded)"
          #tab-1
        >
          <GpsMap
            :collection="postsItems"
            @map-loaded="() => hasMapLoaded = true"
          />
        </template>
      </GpsTabs>
    </template>
  </GpsGrid>
</template>

<style scoped lang="scss">

.gps-posts__sidebar {
  position: relative;

  .gps-posts__sidebar__posts {
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

.gps-posts__posts-container {
  padding: 4px;
  overflow: hidden;
  position: relative;
}

</style>
