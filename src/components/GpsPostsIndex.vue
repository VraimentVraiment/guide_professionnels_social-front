<script setup lang="ts" generic="PostType extends GpsPost">

import { DsfrCard, DsfrFileDownload } from '@gouvminint/vue-dsfr'

const props = defineProps<{
  postStore: ReturnType<typeof useDispositifPostStore | typeof useFicheTechniquePostStore>
  doUseSearchStore?: boolean
  doUseMap?: boolean
  cardType: 'link' | 'file'
  getCardProps:(postItem: PostType) => typeof DsfrCard | typeof DsfrFileDownload
}>()

const content = await queryContent('/components/posts-index').findOne()

const isPostsTabSelected = ref(true)
const hasMapLoaded = ref(false)

await props.postStore.fetchInitialCollections()
onMounted(() => {
  props.postStore.watchPostFiltering()
})
const {
  resetableCheckedItems,
  localisedPostItems: postsItems,
} = storeToRefs(props.postStore)

const checkedItemsObserver = useCheckedItemsObserver(resetableCheckedItems)

const searchStore = props.doUseSearchStore ? useLocationSearchStore() : null

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

const filterSideBar = ref(null)
const { top } = { top: 0 }
// const { top } = useElementBounding(filterSideBar) ?? { top: 0 }
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

const gpsPostsContainer = ref<HTMLDivElement & { scrollTop:() => void } | null>(null)
const updatePagination = (
  pageIndex: number,
) => {
  props.postStore.updatePagination(pageIndex)
  gpsPostsContainer.value?.scrollTop()
}

</script>

<template>
  <GpsPageTitle
    :class="[
      'fr-mb-4w',
    ]"
  />
  <GpsGrid>
    <template #left>
      <GpsFilterSideBar
        ref="filterSideBar"
        :post-store="postStore"
        :checked-items-observer="checkedItemsObserver"
        :do-use-search-store="doUseSearchStore"
      >
        <template #before-content>
          <DsfrTag
            aria-pressed
            :label="`${postStore.postsCollection.itemsCount} résultats`"
            :class="[
              'gps-posts__pagination__nresults',
              'fr-mb-2w',
              'fr-mt-2w',
              'fr-mt-md-0',
            ]"
          />
        </template>
      </GpsFilterSideBar>
    </template>
    <template #right>
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
            <template v-else-if="postStore.postsCollection.itemsCount">
              <GpsPostCardGrid
                ref="gpsPostsContainer"
                :class="[
                  'gps-posts__posts',
                ]"
                :style="{
                  maxHeight,
                }"
                :collection="(postsItems as unknown as PostType[])"
                :get-card-props="getCardProps"
                :type="cardType"
              />
              <div
                :class="[
                  'gps-posts__pagination',
                ]"
              >
                <DsfrPagination
                  v-if="postStore.pagination.totalPages > 1"
                  :class="[
                    'gps-posts__pagination__pagination',
                  ]"
                  :pages="new Array(postStore.pagination.totalPages)
                    .fill(null)
                    .map((_, i) => {
                      return {
                        label: `${i + 1}`,
                        href: `?page=${i + 1}`,
                        title: `Page de résultat numéro ${i + 1}`,
                      }
                    })"
                  :current-page="postStore.pagination.currentPage"
                  :first-page-title="'Premiers résultats'"
                  :last-page-title="'Derniers résultats'"
                  :prev-page-title="isPostsTabSelected ? 'Précédents' : ''"
                  :next-page-title="isPostsTabSelected ? 'Suivants' : ''"
                  @update:current-page="updatePagination"
                />
              </div>
            </template>
            <template v-else>
              <p>
                {{ content.emptyMessage }}
              </p>
            </template>
          </div>
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
}

// .gps-posts__pagination {
// }

.gps-posts__posts-container {
  padding: 4px;
  overflow: hidden;
}

.gps-posts__posts {
  padding-top: 1rem;
  overflow: hidden auto;
}
</style>

<style lang="scss">
.gps-posts__pagination a.fr-pagination__link {
  margin-bottom: 0 !important;
}
</style>
