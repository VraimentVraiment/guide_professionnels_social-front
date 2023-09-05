<script setup lang="ts">

import { storeToRefs } from 'pinia'

definePageMeta({
  layout: 'default',
  middleware: [
    'fichesdispositif',
  ],
})

const postStore = useDispositifPostStore()
const { checkedItems } = storeToRefs(postStore)
const { resetAll: resetAllCheckedItems } = useCheckedItemsObserver(checkedItems)

const {
  thematiquesItems,
  selectedThematique,
  typesRootNode,
} = storeToRefs(useGpsSelectedThematiqueStore())

const content = await queryContent('/pages/home').findOne()
const alertModel = useDsfrAlertModel(content.messages)

alertModel.show('info')

const stepOne = () => {
  resetAllCheckedItems()
  alertModel.setStep(0)
}

const stepTwo = (id: number) => {
  postStore.setItem({
    collectionName: 'gps_thematiques',
    id,
    value: true,
  })

  postStore.fetchCollection('gps_typesdispositif')
  if (
    postStore.filtersCollections.find(c => c.collectionName === 'gps_typesdispositif')?.items.length === 0
  ) {
    navigateTo('/dispositifs')
  } else {
    alertModel.setStep(1)
  }
}

stepOne()

</script>

<template>
  <GpsGrid show-title>
    <template #top-right>
      <GpsSearchModule />
    </template>
    <template #bottom-left>
      <div class="fr-container--fluid">
        <div class="fr-grid-row">
          <DsfrAlert
            title-tag="h2"
            :class="[
              'fr-col-12',
              'fr-col-lg-8',
              'fr-mb-4w'
            ]"
            v-bind="alertModel.props.value"
          />
        </div>
      </div>
    </template>
    <template #bottom-right>
      <div
        v-if="!selectedThematique"
        :class="[
          'fr-container--fluid'
        ]"
      >
        <div
          :class="[
            'fr-grid-row',
            'fr-grid-row--gutters',
          ]"
        >
          <ClientOnly>
            <div
              v-for="{ id, name, pictogramme } in thematiquesItems"
              :key="id"
              :class="[
                'fr-col-12',
                'fr-col-sm-6'
              ]"
            >
              <DsfrTile2
                :title="name"
                horizontal
                to=""
                :img-src="useGetDirectusFileLink(pictogramme)"
                title-tag="h2"
                @click.prevent="() => stepTwo(id)"
              />
            </div>
          </ClientOnly>
        </div>
      </div>
      <template v-else>
        <div
          :class="[
            'fr-container--fluid'
          ]"
        >
          <div
            :class="[
              'fr-grid-row'
            ]"
          >
            <h2
              :class="[
                'fr-col-12',
                'fr-mb-1w'
              ]"
            >
              {{ selectedThematique?.name }}
            </h2>
            <DsfrButtonGroup
              inline-layout-when="large"
              :class="[
                'fr-mb-4v',
                'fr-mt-4v',
              ]"
              :buttons="[
                {
                  label: content.backLinkLabel,
                  tertiary: true,
                  icon: 'ri-arrow-left-line',
                  onClick: stepOne,
                },
                {
                  label: content.allTypesLabel,
                  tertiary: true,
                  iconRight: true,
                  icon: 'ri-arrow-right-line',
                  onClick: () => navigateTo('/dispositifs'),
                },
              ]"
            />
            <GpsDispositifsPostsLinks
              v-if="typesRootNode?.children"
              :class="[
                'fr-col-12',
                'fr-col-lg-10',
              ]"
              :root-node="typesRootNode"
            />
          </div>
        </div>
      </template>
    </template>
  </GpsGrid>
</template>
