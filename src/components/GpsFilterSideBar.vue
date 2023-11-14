<script setup lang="ts">

defineProps<{
  postStore: ReturnType<typeof useDispositifPostStore | typeof useFicheTechniquePostStore>
  checkedItemsObserver: ReturnType<typeof useCheckedItemsObserver>
  doUseSearchStore?: boolean
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
    >
      <slot name="before-content" />
      <DsfrAccordionsGroup>
        <li
          v-if="doUseSearchStore"
        >
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
              <GpsSearchModule />
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
                { 'has-active-content': checkedItemsObserver.hasCollectionCheckedItems(collectionName) }
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

<style lang="scss">

.fr-sidemenu__title {
  display: none;

  @include dsfr.md {
    display: block;
  }
}

.has-active-content {
  .fr-accordion__title {
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
