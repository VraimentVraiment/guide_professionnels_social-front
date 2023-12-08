<script setup lang="ts">

defineProps<{
  postStore: ReturnType<typeof useDispositifPostStore | typeof useFicheTechniquePostStore>
  checkedItemsObserver: ReturnType<typeof useCheckedItemsObserver>
  doUseSearchStore?: boolean
  maxHeight?: string
}>()

const content = await queryContent('/components/gps-filter-sidebar').findOne()

const expandedId = ref<string | undefined>()
const expand = (event: string | undefined): any => {
  expandedId.value = event
}

const {
  selectedCityList,
} = storeToRefs(useLocationSearchStore())

</script>

<template>
  <div>
    <DsfrSideMenu
      :heading-title="'Filtrer les résultats'"
      :button-label="'Filtrer les résultats'"
      :class="[
        'gps-filters-sidebar',
      ]"
      :style="{
        maxHeight,
      }"
    >
      <slot name="before-content" />
      <DsfrAccordionsGroup
        class="fr-my-2w md:fr-my-0"
      >
        <li v-if="doUseSearchStore">
          <DsfrAccordion
            :expanded-id="expandedId"
            :title="'Communes'"
            :class="[
              { 'has-active-content': selectedCityList?.length }
            ]"
            @expand="expand"
          >
            <div
              :class="[
                'fr-py-2w'
              ]"
            >
              <GpsLocationSearchBar />
            </div>
          </DsfrAccordion>
        </li>
        <template
          v-for="{ collectionName, label } in postStore.filtersCollections"
          :key="collectionName"
        >
          <li
            v-if="postStore.rootNodes.find(node => node?.data.name === collectionName)?.children"
            :id="collectionName"
          >
            <DsfrAccordion
              :expanded-id="expandedId"
              :title="label"
              :class="[
                { 'has-active-content': postStore.checkedItems
                  ?.find(item => item?.collectionName === collectionName)
                  ?.items
                  ?.some(item => item?.checked) ?? false
                }
              ]"
              @expand="expand"
            >
              <div
                :class="[
                  'fr-py-2w'
                ]"
              >
                <DsfrButton
                  v-show="checkedItemsObserver.hasCollectionCheckedItems(collectionName)"
                  :class="[
                    'fr-mb-2v',
                  ]"
                  :label="content.resetLabel"
                  tertiary
                  no-outline
                  size="small"
                  :icon="'ri-close-circle-line'"
                  icon-right
                  @click="() => checkedItemsObserver.resetCollection(collectionName)"
                />
                <GpsFilterNode
                  :post-store="postStore"
                  :node="postStore.rootNodes.find(node => node?.data.name === collectionName) ?? null"
                  is-root-node
                />
              </div>
            </DsfrAccordion>
          </li>
        </template>
      </DsfrAccordionsGroup>
    </DsfrSideMenu>
  </div>
</template>

<style scoped lang="scss">

:deep(.fr-sidemenu) {
  padding: 0;
  overflow-y: auto;
  filter: drop-shadow(var(--overlap-shadow));

  .fr-sidemenu__inner {
    background: var(--background-default-grey);

    @include dsfr.md {
      padding-left: 1rem;
      padding-top: 1rem;
      padding-bottom: 1rem;
    }
  }
}

:deep(.fr-sidemenu__title) {
  display: none;

  @include dsfr.md {
    display: block;
  }
}

:deep(.has-active-content) {
  &>.fr-accordion__title {
    position: relative;

    &::after {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 3px;
      background: var(--text-active-blue-france);
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: .25rem;
    }
  }
}
</style>
