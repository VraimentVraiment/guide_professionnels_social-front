<script lang="ts" setup>

import { storeToRefs } from 'pinia'

const content = await queryContent('/components/gps-search-bar').findOne()

const searchStore = useSearchStore()
searchStore.watchQuery()

const {
  query,
  queryCityList,
  selectedCityList,
  postItems,
  openModal,
} = storeToRefs(searchStore)

</script>

<template>
  <div
    :class="[
      'gps-search fr-mb-2v'
    ]"
  >
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
    <DsfrSearchBar
      v-model="query"
      :class="[
        'gps-search__bar'
      ]"
      :label="content.searchBarPlaceholder"
      :button-text="content.searchButtonText"
      :placeholder="content.searchBarPlaceholder"
      large
      @search="searchStore.submit"
    />
    <div
      :class="[
        'gps-search__modal-wrapper'
      ]"
    >
      <div
        v-if="openModal"
        :class="[
          'gps-search__modal'
        ]"
      >
        <div
          v-if="queryCityList.length"
          :class="[
            'gps-search__modal__tags'
          ]"
        >
          <h6>
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
              @click="() => searchStore.add(cityName)"
            />
          </div>
        </div>
        <div
          v-if="postItems.length"
          :class="[
            'gps-search__modal__posts'
          ]"
        >
          <h6>
            {{ content.postsResultsLabel }}
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
                ]"
              >
                {{ item.name }}
                <v-icon
                  :name="'ri-arrow-right-line'"
                  aria-hidden="true"
                />
              </NuxtLink>
            </li>
          </ul>
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
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/";

.gps-search {
  position: relative;

  .gps-search__tags {
    display: flex;
    flex-wrap: wrap;
    justify-items: space-between;
    width: 100%;

    &.has-tags {
      margin-bottom: .75rem;
    }

    .fr-tag {
      margin: 0.5rem 0.5rem 0 0;
    }
  }

  .gps-search__modal {
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

      @include sm {
        max-width: 80%;
      }

      @include md {
        max-width: 90%;
      }
    }

    .gps-search__close-button {
      position: absolute;
      top: .5rem;
      right: .5rem;
    }

    .gps-search__modal__tags {
      margin-bottom: 2rem;

      h6 {
        margin-bottom: 0.5rem;
      }

    }

    .gps-search__modal__posts {
      ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          margin-bottom: 0.5rem;
        }
      }
    }

    .gps-search__modal__tags+.gps-search__modal__posts {
      margin-top: 2rem;
    }
  }
}
</style>
