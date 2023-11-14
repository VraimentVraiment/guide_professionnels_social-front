<script setup lang="ts">

const content = await queryContent('/components/header').findOne()

const isAuthenticated = useIsAuthenticated()

const {
  serviceTitle,
  serviceDescription,
  logoText,
} = appConfigPatch as unknown as Required<{
// } = useAppConfig() as unknown as Required<{
  serviceTitle: string
  serviceDescription: string
  logoText: string
}>

const quickLinks = computed(() => {
  return content.quickLinks
    ?.filter((quickLink: GpsQuickLink) => {
      return isAuthenticated.value || quickLink.public
    }) ?? []
})

const { someModalOpen } = useSomeModalOpen()

const searchStore = usePostSearchStore()

const modalModel = useSimpleModal()

const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})

const { breakpoints } = useDsfrBreakpoints()
const smallerThanLg = breakpoints.smaller('LG')

</script>

<template>
  <div>
    <DsfrHeader
      :class="[
        'gps-header',
        'noprint',
        { 'has-modal-ontop': someModalOpen },
      ]"
      :logo-text="logoText"
      :service-title="serviceTitle"
      :service-description="serviceDescription"
      :quick-links="quickLinks"
      :show-search="isAuthenticated"
      :search-label="content.searchBar.label"
      :model-value="searchStore.query"
      :placeholder="content.searchBar.placeholder"
      @search="async() => {
        await searchStore.submit()
        if (searchStore.postItems.length > 0) {
          modalModel.isOpen.value = true
        }
      }"
      @update:model-value="searchStore.query = $event"
    >
      <template #mainnav="{ hidemodal }">
        <GpsMainNav
          @route-change="hidemodal"
        />
      </template>
    </DsfrHeader>
    <Teleport
      v-if="mounted && modalModel.isOpen.value"
      :to="smallerThanLg ? '.fr-modal--opened .fr-search-bar' : '.fr-search-bar'"
    >
      <GpsSearchModal
        :style="{
          transform: smallerThanLg ? 'translateY(-100%)' : 'translateY(0)',
        }"
        :model="modalModel"
      >
        <h6
          :class="[
            'fr-mt-4w',
            'fr-mb-2w',
          ]"
        >
          {{ content.searchBar.resultsLabel }}
        </h6>
        <ul class="gps-posts-list">
          <li
            v-for="item in searchStore.postItems"
            :key="item.id"
          >
            <NuxtLink
              :to="`/dispositifs/${item.id}`"
              :class="[
                'fr-link',
              ]"
              @click="modalModel.close()"
            >
              {{ item.name }}
              <v-icon
                :name="'ri-arrow-right-line'"
                aria-hidden="true"
              />
            </NuxtLink>
          </li>
        </ul>
      </GpsSearchModal>
    </Teleport>
  </div>
</template>

<style scoped lang="scss">
.gps-header:deep() {
  @include dsfr.lg {
    .fr-search-bar {
      position: relative !important;
    }
  }

  .gps-search__modal {
    text-align: left;
  }

  /**
    * When some modal is open, we need to set the footer z-index to -1
    * to avoid the modal to be hidden by the footer
    * We cannot set z-index to -1 everywhere because it would prevent some
    * links in the footer from beeing clicked
   */
  &.has-modal-ontop {
    position: relative;
    z-index: -1;
  }
}

.gps-posts-list {
  max-height: 20rem;
  overflow: auto;

  a {
    --underline-img: linear-gradient(0deg,currentcolor,currentcolor) !important;
  }

  li + li {
    margin-top: .75rem;
  }
}
</style>
