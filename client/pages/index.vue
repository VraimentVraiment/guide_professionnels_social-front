<script setup lang="ts">

definePageMeta({
  layout: 'filter',
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

const filterStore = useFilterStore()

const items = filterStore.getItems('thematiques')

const themeId = ref<Number | null>(null)
const rootNode = ref<FilterItemNode | null>(null)

const setThematique = async (
  id: number,
) => {

  if (id === themeId.value) {
    return
  }

  filterStore.setItem(
    'thematiques',
    id,
    'checked',
    true,
  )

  themeId.value = id
  const newTypes = await useFetchDirectusItems<DirectusFilter>({
    collectionName: 'types_dispositif',
    filter: {
      'thematique': {
        "_eq": id,
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
      <div class="fr-container--fluid">
        <div class="fr-grid-row">
          <DsfrAlert
            class="fr-col-8"
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
        class="gps-tiles fr-container--fluid"
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
          <div class="fr-col-12 fr-col-sm-6">
            <DsfrTile
              :title="'Tous les dispositifs'"
              :description="'Tous les dispositifs'"
              horizontal
              @click.prevent="() => setThematique(0)"
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
                    @click="() => filterStore.setItem('types_dispositif', item.data.id, 'checked', true)"
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
                    @click="() => filterStore.setItem('types_dispositif', child.data.id, 'checked', true)"
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
<style lang="scss">
// .gps-tiles {
//   display: flex;
//   flex-wrap: wrap;

//   .fr-grid-row .fr-tile {
//     height: auto;
//   }
// }
</style>