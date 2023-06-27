<script setup lang="ts">

import { storeToRefs } from 'pinia'

definePageMeta({
  layout: 'default',
  middleware: ['collections'],
})

const postStore = useDispositifPostStore()

const {
  thematiquesItems,
  selectedThematique,
  typesRootNode,
} = storeToRefs(useGpsSelectedThematiqueStore())

const { messages } = await useGetContent('/home')
const alertModel = useDsfrAlertModel(messages)
alertModel.show('info')

const openDetails = useCollectionObserver<Number>()

const stepOne = () => {
  postStore.resetFilters()
  alertModel.setStep(0)
}

const stepTwo = (id: number) => {
  postStore.setItem({
    collectionName: 'gps_thematiques',
    id,
    value: true,
  })

  postStore.fetchFiltersCollection('gps_typesdispositif')
  alertModel.setStep(1)
}

stepOne()

</script>

<template>
  <GpsGrid>
    <template #top-right>
      <GpsSearchModule />
    </template>
    <template #bottom-left>
      <div class="fr-container--fluid">
        <div class="fr-grid-row">
          <DsfrAlert
            :class="[
              'fr-col-12',
              'fr-col-lg-8',
            ]"
            v-bind="alertModel.props.value"
          />
        </div>
      </div>
    </template>
    <template #bottom-right>
      <div
        v-if="!selectedThematique"
        class="fr-container--fluid"
      >
        <div
          :class="[
            'fr-grid-row',
            'fr-grid-row--gutters',
          ]"
        >
          <ClientOnly>
            <div
              v-for="{ id, name } in thematiquesItems"
              :key="id"
              class="fr-col-12 fr-col-sm-6"
            >
              <DsfrTile
                :title="name"
                :description="name"
                horizontal
                @click.prevent="() => stepTwo(id)"
              />
            </div>
          </ClientOnly>
        </div>
      </div>
      <template v-else>
        <div class="fr-container--fluid">
          <div class="fr-grid-row">
            <h2 class="fr-col-12 fr-mb-1w">
              {{ selectedThematique?.name }}
            </h2>
            <DsfrButton
              :class="'fr-mb-4w'"
              type="buttonType"
              :label="`Sélectionner une autre thématique`"
              tertiary
              no-outline
              :icon="'ri-arrow-left-line'"
              @click="stepOne"
            />
            <div
              v-if="typesRootNode?.children"
              class="gps-links fr-col-10"
            >
              <details
                v-for="node in typesRootNode.children"
                :key="node.data.id"
                :open="openDetails.has(node.data.id)"
                class="gps-links-group "
                @click.prevent
              >
                <summary>
                  <NuxtLink
                    :key="node.data.id"
                    class="gps-link gps-link__parent fr-link fr-fi-arrow-right-line fr-link--icon-right"
                    :to="`/dispositifs`"
                    @click="() => postStore.setItem({
                      collectionName: 'gps_typesdispositif',
                      id: node.data.id,
                      value: true,
                    })"
                  >
                    {{ node.data.name }}
                  </NuxtLink>
                  <DsfrButton
                    primary
                    icon-only
                    size="small"
                    :icon="!openDetails.has(node.data.id) ? 'ri-add-line' : 'ri-subtract-line'"
                    @click="() => openDetails.toggle(node.data.id)"
                  />
                </summary>
                <div
                  v-if="node?.children?.length"
                  class="gps-link-group__children"
                >
                  <NuxtLink
                    v-for="childNode in node.children"
                    :key="childNode.data.id"
                    class="gps-link gps-link__child fr-link fr-fi-arrow-right-line fr-link--icon-right"
                    :to="`/dispositifs`"
                    @click="() => postStore.setItem({
                      collectionName: 'gps_typesdispositif',
                      id: childNode.data.id,
                      value: true,
                    })"
                  >
                    {{ childNode.data.name }}
                  </NuxtLink>
                </div>
              </details>
            </div>
          </div>
        </div>
      </template>
    </template>
  </GpsGrid>
</template>

<style scoped lang="scss">
.gps-links {
  padding: 1rem;
  background: var(--background-default-grey);
  border: 1px solid var(--border-default-grey);
  color: var(--alt-blue-france);
}

details.gps-links-group {

  +details.gps-links-group {
    margin-top: 1.5rem;
  }

  summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: default;

    button {
      padding: .065rem .5rem;
    }
  }

  .gps-link-group__children {
    padding-left: 1rem;
    padding-right: 5rem;
    display: flex;
    flex-direction: column;
  }
}

.gps-link {
  display: block;

  &.gps-link__parent {
    font-size: 18px;
    margin-right: 2rem;
  }

  &.gps-link__child {
    margin-top: 0.75rem;
    display: inline-block;
    margin-right: auto;
  }
}
</style>
