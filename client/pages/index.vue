<script setup lang="ts">

import {
  type HierarchyNode,
} from 'd3-hierarchy'

definePageMeta({
  layout: 'dispositifs',
})

const {
  alertTitle,
  alertDescription,
} = useAlertStore()

const { alertContent } = await useGetContent('/home')
alertTitle.value = alertContent[0].title
alertDescription.value = alertContent[0].description

const postStore = useDispositifPostStore()
postStore.resetFilters()

const items = postStore.filtersCollections
  ?.find((collection) => {
    return collection.collectionName === 'gps_thematiques'
  })
  ?.items

const themeId = ref<Number | null>(null)
const rootNode = ref<HierarchyNode<FilterItemNode> | null>(null)
const selectedThematique = computed(() => {
  if (themeId.value === null) {
    return null
  }
  return items?.find(item => item.id === themeId.value)?.name
})

watch(rootNode, (node) => {
  if (node) {
    alertTitle.value = alertContent[1].title
    alertDescription.value = alertContent[1].description
  }
})

const openDetails = useCollectionObserver<Number>()

const setThematique = async (
  id: number,
) => {

  if (id === themeId.value) {
    return
  }

  postStore.setItem({
    collectionName: 'gps_thematiques',
    id,
    value: true,
  })

  themeId.value = id
  const newTypes = await useFetchDirectusItems<DirectusFilter>({
    collectionName: 'gps_typesdispositif',
    params: {
      filter: {
        'thematique_id': {
          'gps_thematiques_id': {
            "_eq": id,
          },
        },
      },
    },
  })

  rootNode.value = stratifyFilters({
    items: newTypes,
    name: 'gps_types_dispositif',
  })
}

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
            :type="'info'"
            :title="alertTitle"
            :description="alertDescription"
          />
        </div>
      </div>
    </template>
    <template #bottom-right>
      <div
        v-if="themeId === null"
        class="fr-container--fluid"
      >
        <div
          :class="[
            'fr-grid-row',
            'fr-grid-row--gutters',
          ]"
        >
          <div
            v-for="{ id, name } in items"
            :key="id"
            class="fr-col-12 fr-col-sm-6"
          >
            <DsfrTile
              :title="name"
              :description="name"
              horizontal
              @click.prevent="() => setThematique(id)"
            />
          </div>
        </div>
      </div>
      <template v-else-if="rootNode?.children">
        <div class="fr-container--fluid">
          <div class="fr-grid-row">
            <h2>{{ selectedThematique }}</h2>
            <div class="gps-links fr-col-10">
              <details
                v-for="node in rootNode.children"
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