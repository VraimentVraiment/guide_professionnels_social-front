<script setup lang="ts">

import { storeToRefs } from 'pinia'

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

if (!postStore.postsCollectionName) {
  postStore.setPostCollection('gps_fichesdispositif')
}
await postStore.fetchInitialCollections()

const router = useRouter()

alertModel.show('info')

const stepOne = () => {
  resetAllCheckedItems()
  alertModel.setStep(0)
}

const lastStep = () => {
  navigateTo('/dispositifs')
}

const stepTwo = async(id: number) => {
  postStore.setItem({
    collectionName: 'gps_thematiques',
    id,
    value: true,
  })

  await postStore.fetchCollection('gps_typesdispositif')

  if (typesRootNode.value?.children?.length) {
    alertModel.setStep(1)
    router.push({
      query: {
        thematique: id,
      },
    })
  } else {
    lastStep()
  }
}

watch(() => router.currentRoute.value.query, (query) => {
  if (
    router.currentRoute.value.path === '/' &&
    !query?.thematique
  ) {
    stepOne()
  } else if (query.thematique) {
    const id = parseInt(query.thematique as string, 10)
    stepTwo(id)
  }
}, {
  immediate: true,
})

</script>

<template>
  <GpsGrid v-show="thematiquesItems?.length">
    <template #top-left>
      <GpsPageTitle />
    </template>
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
        :class="[
          'fr-container--fluid'
        ]"
      >
        <div
          :class="[
            'fr-grid-row',
            { 'fr-grid-row--gutters': !selectedThematique }
          ]"
          :style="{
            padding: '4px'
          }"
        >
          <template v-if="!selectedThematique">
            <div
              v-for="{ id, name, pictogramme } in thematiquesItems"
              :key="id"
              :class="[
                'fr-col-12',
                'fr-col-sm-6'
              ]"
            >
              <DsfrTile
                :title="name"
                horizontal
                :to="'#'"
                :img-src="useGetDirectusFileLink(pictogramme)"
                title-tag="h2"
                @click.prevent="() => stepTwo(id)"
              />
            </div>
          </template>
          <template v-else>
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
                  onClick: () => router.push('/'),
                },
                {
                  label: content.allTypesLabel,
                  tertiary: true,
                  iconRight: true,
                  icon: 'ri-arrow-right-line',
                  onClick: lastStep,
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
          </template>
        </div>
      </div>
    </template>
  </GpsGrid>
</template>
