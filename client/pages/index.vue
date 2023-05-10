<script setup lang="ts">

import {
  type RouteLocationRaw,
} from 'vue-router'

definePageMeta({
  layout: 'default',
})

function useAlertStore() {
  const alertTitle = ref('')
  const alertDescription = ref('')
  const alertType = ref('')
  const openAlert = ref(false)

  function closeAlert() {
    openAlert.value = false
  }

  return {
    alertTitle,
    alertDescription,
    alertType,
    openAlert,
    closeAlert,
  }
}

const {
  alertTitle,
  alertDescription,
} = useAlertStore()

alertTitle.value = 'Étape 1 : Thématiques'
alertDescription.value = 'Sélectionnez une ou plusieurs thématiques au sein de laquelle vous souhaitez explorer les dispositifs.'

const items = await useFetchDirectusItems<{ id: number, name: string }>({
  collectionName: 'thematiques',
})

const types = ref([])
const rootNode = ref([])

const setThematique = async (id: number) => {
  const newTypes = await useFetchDirectusItems<DirectusFilter>({
    collectionName: 'types_dispositif',
    filter: {
      'thematique': {
        "_eq": id,
      },
    },
  })

  types.value = newTypes
  rootNode.value = stratifyFilters({
    name: 'test',
    label: 'test',
    items: newTypes,
  })
  console.log("rootNode.value :", rootNode);
}

watch(() => types.value, (newTypes) => {
  if (newTypes.length) {
    alertTitle.value = 'Étape 2 : Types de dispositifs'
    alertDescription.value = 'Sélectionnez un type de dispositif que vous souhaitez explorer. Appuyer sur “+” pour accéder à des types de dispositifs plus précis.'
  }
})

</script>

<template>
  <GpsGrid>
    <template #top-right>
      <GpsSearchModule />
    </template>
    <template #bottom-left>
      <DsfrAlert
        :title="alertTitle"
        :description="alertDescription"
        :type="'info'"
      />
    </template>
    <template #bottom-right>
      <div
        v-if="!types.length"
        class="gps-tiles fr-container"
      >
        <div
          :class="[
            'fr-grid-row',
          // 'fr-grid-row--gutters',
          ]"
        >
          <DsfrTile
            v-for="item in items"
            :key="item.id"
            class="fr-col-6"
            :title="item.name"
            :description="item.name"
            @click.prevent="() => setThematique(item.id)"
          />
          <DsfrTile
            class="fr-col-6"
            :title="'Tous les dispositifs'"
            :description="'Tous les dispositifs'"
            @click.prevent="() => setThematique(0)"
          />
        </div>
      </div>
      <template v-if="types.length">
        <template
          v-for="item in rootNode.children"
          :key="item.id"
        >
          <details>
            <summary>
              <NuxtLink
                :key="item.id"
                :to="`/dispositifs?thematique=${item.data.id}&type=${item.data.id}`"
              >
                {{ item.data.name }}
              </NuxtLink>
              <DsfrButton
                primary
                icon-only
                size="small"
                icon="ri-add-line"
              />
            </summary>
            <template v-if="item.children.length">
              <NuxtLink
                v-for="child in item.children"
                :key="child.id"
                :to="`/dispositifs?thematique=${item.data.id}&type=${child.data.id}`"
              >
                {{ child.data.name }}
              </NuxtLink>
            </template>
          </details>
        </template>
      </template>
    </template>
  </GpsGrid>
</template>

<style lang="scss">
.gps-tiles {
  display: flex;
  flex-wrap: wrap;

  .fr-grid-row .fr-tile {
    height: auto;
  }
}
</style>