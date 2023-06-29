<script lang="ts" setup>

import { storeToRefs } from 'pinia'

const searchStore = useSearchStore()

const {
  query,
  queryCityList,
  selectedCityList,
  postItems,
  openModal,
} = storeToRefs(searchStore)

const searchBarPlaceholder = 'Rechercher une commune ou un dispositif'
const searchButtonText = 'Rechercher'

</script>

<template>
  <div class="gps-search fr-mb-3w">
    <div class="gps-search--tags">
      <DsfrTag
        v-for="cityName in selectedCityList"
        :key="cityName"
        class="fr-tag--dismiss"
        :label="cityName"
        tag-name="button"
        @click="() => searchStore.remove(cityName)"
      />
    </div>
    <DsfrSearchBar
      v-model="query"
      class="gps-search--bar"
      :button-text="searchButtonText"
      :placeholder="searchBarPlaceholder"
      large
      @search="searchStore.submit"
    />
    <div class="gps-search--modal-wrapper">
      <div
        v-if="openModal"
        class="gps-search--modal"
      >
        <div
          v-if="queryCityList.length"
          class="gps-search--modal--tags"
        >
          <h6>
            Résultats dans la liste des communes
          </h6>
          <div class="gps-search--tags">
            <DsfrTag
              v-for="cityName in queryCityList"
              :key="cityName"
              :label="cityName"
              tag-name="button"
              @click="() => searchStore.add(cityName)"
            />
          </div>
        </div>
        <div
          v-if="postItems.length"
          class="gps-search--modal--posts"
        >
          <h6>
            Résultats dans la liste des fiches dispositifs
          </h6>
          <ul>
            <li
              v-for="item in postItems"
              :key="item.id"
            >
              <NuxtLink
                :to="`/dispositifs/${item.id}`"
                :class="[
                  'fr-link',
                  'fr-fi-arrow-right-line',
                  'fr-link--icon-right',
                ]"
              >
                {{ item.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <DsfrButton
          class="gps-search--close-button"
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
    </div>
  </div>
</template>

<style scoped lang="scss">
.gps-search {
  position: relative;

  .gps-search--tags {
    display: flex;
    flex-wrap: wrap;
    justify-items: space-between;
    width: 100%;
    margin-bottom: .75rem;

    .fr-tag {
      margin: 0.5rem 0.5rem 0 0;
    }
  }

  .gps-search--modal {
    border: 2px solid var(--border-active-blue-france);
    position: absolute;
    top: calc(100% - 2px);
    left: 0;
    z-index: 1000;
    width: 100%;
    padding: 1.5rem;
    background-color: var(--background-default-grey);
    border-radius: 0 0 4px 4px;
    box-shadow: 0 6px 18px 0 rgb(0 0 18 / 16%);
    max-height: 350px;
    overflow-y: auto;

    h6 {
      max-width: 60%;
    }

    .gps-search--close-button {
      position: absolute;
      top: .5rem;
      right: .5rem;
    }

    .gps-search--modal--tags {
      margin-bottom: 2rem;

      h6 {
        margin-bottom: 0.5rem;
      }

    }

    .gps-search--modal--posts {
      ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          margin-bottom: 0.5rem;
        }
      }
    }

    .gps-search--modal--tags+.gps-search--modal--posts {
      margin-top: 2rem;
    }
  }
}
</style>
