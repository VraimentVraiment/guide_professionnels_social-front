<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core'

const content = await queryContent('/components/gps-search-bar').findOne()

const searchStore = useLocationSearchStore()

const {
  query,
  queryCityList,
  selectedCityList,
} = storeToRefs(searchStore)

const openModal = ref(false)

const target = ref(null)

onClickOutside(target, () => {
  openModal.value = false
})

</script>

<template>
  <div
    :class="[
      'gps-search'
    ]"
  >
    <DsfrSearchBar
      v-model="query"
      :class="[
        'gps-search__bar',
      ]"
      :label="content.searchBarPlaceholder"
      :button-text="content.searchButtonText"
      :placeholder="content.searchBarPlaceholder"
      @search="async() => {
        await searchStore.submit()
        if (queryCityList?.length > 0) {
          openModal = true
        }
      }"
    />
    <div
      v-if="openModal"
      ref="target"
      :class="[
        'gps-search__modal',
        'fr-p-2w',
        'fr-mb-2w',
      ]"
    >
      <div
        v-if="queryCityList.length"
        :class="[
          'gps-search__modal__tags',
        ]"
      >
        <h6
          :class="[
            'fr-text--md',
            'fr-mb-1w'
          ]"
        >
          {{ content.cityResultsLabel }}
        </h6>
        <div
          :class="[
            'gps-search__tags',
            { 'has-tags': queryCityList.length > 0 }
          ]"
        >
          <DsfrTag
            v-for="cityName in queryCityList"
            :key="cityName"
            :label="cityName"
            tag-name="button"
            @click="() => {
              searchStore.add(cityName)
              openModal = false
            }"
          />
        </div>
      </div>

      <DsfrButton
        :class="[
          'gps-search__close-button'
        ]"
        type="buttonType"
        :label="'Fermer'"
        tertiary
        size="small"
        icon="ri-close-line"
        no-outline
        icon-right
        @click="() => openModal = false"
      />
    </div>
    <div
      :class="[
        'gps-search__tags',
        { 'has-tags': selectedCityList.length > 0 }
      ]"
    >
      <DsfrTag
        v-for="cityName in selectedCityList"
        :key="cityName"
        :class="[
          'fr-tag--dismiss'
        ]"
        :label="cityName"
        tag-name="button"
        @click="() => searchStore.remove(cityName)"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">

.gps-search {
  position: relative;

  .gps-search__tags {
    display: flex;
    flex-wrap: wrap;
    justify-items: space-between;
    width: 100%;

    .fr-tag {
      margin: 0.5rem 0.5rem 0 0;
    }
  }

  .gps-search__modal {
    border: 1px solid var(--border-default-grey);
    position: relative;
    background-color: var(--background-default-grey);
    filter: drop-shadow(var(--overlap-shadow));

    h6 {
      max-width: 60%;
    }

    .gps-search__close-button {
      position: absolute;
      top: .25rem;
      right: .25rem;
    }
  }
}
</style>
