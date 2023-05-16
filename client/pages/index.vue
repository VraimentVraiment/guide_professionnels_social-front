<script setup lang="ts">

import {
  type HierarchyNode,
} from 'd3-hierarchy'

definePageMeta({
  layout: 'filter',
})

const {
  alertTitle,
  alertDescription,
} = useAlertStore()

const { alertContent } = await useGetContent('/home')
alertTitle.value = alertContent[0].title
alertDescription.value = alertContent[0].description

const filterStore = useFilterStore()

const items = filterStore.getCollectionItems('thematiques')

const themeId = ref<Number | null>(null)
const rootNode = ref<HierarchyNode<RootFilterItem> | null>(null)

const setThematique = async (
  id: number,
) => {

  if (id === themeId.value) {
    return
  }

  filterStore.setItem({
    collectionName: 'thematiques',
    itemId: id,
    key: 'checked',
    value: true,
  })

  themeId.value = id
  const newTypes = await useFetchDirectusItems<DirectusFilter>({
    collectionName: 'types_dispositif',
    params: {
      filter: {
        'thematique': {
          "_eq": id,
        },
      },
    },
  })

  rootNode.value = stratifyFilters({
    items: newTypes,
    name: 'types_dispositif',
  })
}

watch(rootNode, (node) => {
  if (node) {
    alertTitle.value = alertContent[1].title
    alertDescription.value = alertContent[1].description
  }
})

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
            :title="alertTitle"
            :description="alertDescription"
            :type="'info'"
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
            v-for="item in items"
            :key="item.id"
            class="fr-col-12 fr-col-sm-6"
          >
            <DsfrTile
              :title="item.name"
              :description="item.name"
              horizontal
              @click.prevent="() => setThematique(item.id)"
            />
          </div>
        </div>
      </div>
      <template v-else-if="rootNode?.children">
        <div class="fr-container--fluid">
          <div class="fr-grid-row">
            <div class="gps-links fr-col-10">
              <details
                v-for="item in rootNode.children"
                :key="item.id"
                :open="item?.data?.open"
                class="gps-links-group "
                @click.prevent
              >
                <summary>
                  <NuxtLink
                    :key="item.id"
                    class="gps-link gps-link__parent fr-link fr-fi-arrow-right-line fr-link--icon-right"
                    :to="`/dispositifs`"
                    @click="() => filterStore.setItem({
                      collectionName: 'types_dispositif',
                      itemId: item.data.id,
                      key: 'checked',
                      value: true,
                    })"
                  >
                    {{ item.data.name }}
                  </NuxtLink>
                  <DsfrButton
                    primary
                    icon-only
                    size="small"
                    :icon="!item.data.open ? 'ri-add-line' : 'ri-subtract-line'"
                    @click="() => item.data.open = !item.data.open"
                  />
                </summary>
                <div
                  v-if="item?.children?.length"
                  class="gps-link-group__children"
                >
                  <NuxtLink
                    v-for="child in item.children"
                    :key="child.id"
                    class="gps-link gps-link__child fr-link fr-fi-arrow-right-line fr-link--icon-right"
                    :to="`/dispositifs`"
                    @click="() => filterStore.setItem({
                      collectionName: 'types_dispositif',
                      itemId: child.data.id,
                      key: 'checked',
                      value: true,
                    })"
                  >
                    {{ child.data.name }}
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