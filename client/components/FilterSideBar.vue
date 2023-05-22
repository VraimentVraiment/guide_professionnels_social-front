<script setup lang="ts">
import { type HierarchyNode } from 'd3-hierarchy'

const props = defineProps<{
  collections: FiltersCollection[]
  isListSelected: boolean
}>()

const filterStore = useFilterStore()

const isOpen = ref(false)

const { breakpoints } = useDsfrBreakpoints()
const isSmallScreen = breakpoints.smaller('MD')

const isSelectable = computed(() => {
  return (
    isSmallScreen.value
    || !props.isListSelected
  )
})

</script>

<template>
  <ClientOnly>
    <div
      :class="[
        'gps-filters-sidebar',
        { 'open': isOpen },
        { 'is-small-screen': isSmallScreen },
        { 'is-list-selected': isListSelected },
        { 'is-selectable': isSelectable },
      ]"
    >
      <div
        class="gps-filters-sidebar__header"
        @click="() => {
          if (isSelectable) {
            isOpen = !isOpen
          }
        }"
      >
        <span>
          <v-icon
            name="ri-equalizer-fill"
            aria-hidden="true"
          />
          Filtrer
        </span>
        <span
          v-show="isSelectable"
          aria-hidden="true"
          :class="[
            'fr-icon-arrow-left-s-line',
            'gps-filters-sidebar__header__icon'
          ]"
        />
      </div>
      <div class="gps-filters-sidebar__content">
        <DetailsAccordion
          v-for="{ name, label } in collections"
          :key="name"
          class="filter-group"
          :label="label"
          :summary-tag="'h2'"
          :open="name === 'caracteristiques_dispositif'"
        >
          <FilterNode :node="(filterStore.getCollectionRootNode(name)) as HierarchyNode<FilterItemNode>" />
        </DetailsAccordion>
      </div>
    </div>
  </ClientOnly>
</template>

<style scoped lang="scss">
.gps-filters-sidebar {
  background-color: white;
  border: solid 1px var(--border-default-grey);
  border-top: solid 2px var(--text-active-blue-france);

  .gps-filters-sidebar__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1rem;
    font-weight: 700;
    padding: 0.375rem 1rem;
    color: var(--text-active-blue-france);

    .gps-filters-sidebar__header__icon {
      transform: rotate(0deg);
      transition: transform .2s ease-in-out;
    }

    >span svg {
      margin-right: 0.5rem;
    }
  }

  .gps-filters-sidebar__content {
    padding: 0 1rem .5rem;
  }

  &.is-selectable {

    border-color: var(--background-action-low-blue-france);
    border-top-color: var(--background-action-low-blue-france);

    &:hover {
      border-color: var(--background-action-low-blue-france-hover);
      border-top-color: var(--background-action-low-blue-france-hover);
    }

    &:active {
      border-color: var(--background-action-low-blue-france-active);
      border-top-color: var(--background-action-low-blue-france-active);
    }

    .gps-filters-sidebar__header {
      cursor: pointer;
      background-color: var(--background-action-low-blue-france);
      color: var(--text-action-high-grey);

      &:hover {
        background-color: var(--background-action-low-blue-france-hover);
      }

      &:active {
        background-color: var(--background-action-low-blue-france-active);
      }
    }

    .gps-filters-sidebar__content {
      display: none;
    }

    &.open {

      border-color: var(--border-default-grey);
      border-top-color: var(--text-active-blue-france);

      .gps-filters-sidebar__header {
        background-color: var(--background-default-grey);
        color: var(--text-active-blue-france);

        &:hover {
          background-color: var(--background-default-grey-hover);
        }

        &:active {
          background-color: var(--background-default-grey-active);
        }

        .gps-filters-sidebar__header__icon {
          transform: rotate(-90deg);
        }
      }

      .gps-filters-sidebar__content {
        display: block;
      }
    }
  }

  &.is-selectable {
    position: absolute;
    z-index: 10;
    width: 100%;

    &.open {
      box-shadow: 0 0 10px 10px var(--grey-950-125);
    }

    .gps-filters-sidebar__content {
      background: var(--background-default-grey);
    }
  }
}
</style>

<style lang="scss">
.gps-filters-sidebar {

  h2 {
    font-size: 18px;
    font-weight: 700;
    line-height: 1;
  }

  h5 {
    font-size: 1rem;
    font-weight: 700;
    line-height: 1;
    margin-bottom: .5rem;

    &:first-child {
      margin-top: .25rem;
    }

    &:not(:first-child) {
      margin-top: 1rem;
    }
  }

  h6 {
    margin: 0;
    font-size: 1rem;
    font-weight: 400;
  }

  .fr-checkbox-group,
  .fr-radio-group {
    margin-bottom: .75rem;

    label {
      font-size: 1em;
    }
  }
}
</style>