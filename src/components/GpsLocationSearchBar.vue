<script lang="ts" setup>

const content = await queryContent('/components/gps-location-search-bar').findOne()

const searchStore = useLocationSearchStore()

const {
  query,
  queryCityList,
  selectedCityList,
} = storeToRefs(searchStore)

const modalModel = useSimpleModal()

const isNoResults = ref(false)

</script>

<template>
  <div
    :class="[
      'gps-search',
      {'no-results': isNoResults }
    ]"
  >
    <DsfrSearchBar
      v-model="query"
      :label="content.barPlaceholder"
      :button-text="content.submitButtonText"
      :placeholder="content.barPlaceholder"
      @search="async() => {
        if (!query.length) {
          return
        }
        await searchStore.submit()
        if (queryCityList?.length > 0) {
          modalModel.open()
          isNoResults = false
        } else {
          isNoResults = true
        }
      }"
    />
    <GpsSearchModal
      :model="modalModel"
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
          {{ content.resultsLabel }}
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
              modalModel.close()
            }"
          />
        </div>
      </div>
    </GpsSearchModal>
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

  &.no-results {
    animation: shake 0.6s cubic-bezier(.36, .07, .19, .97) both;
  }

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
