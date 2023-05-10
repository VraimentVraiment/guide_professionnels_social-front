<script setup lang="ts">

const props = defineProps<{
  collections: FiltersCollection[]
  isListSelected: boolean
}>()

const isOpen = ref(false)
// const { width } = useWindowSize()

const { breakpoints } = useDsfrBreakpoints()

const isSmallScreen = breakpoints.smaller('MD')

const isSelectable = computed(() => isSmallScreen.value || !props.isListSelected)

</script>

<template>
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
      class="gps-filters-sidebar-header"
      @click="event => {
        if (isSelectable) {
          isOpen = !isOpen
        }
      }"
    >
      <span>
        <v-icon name="ri-equalizer-fill" />
        Filtrer
      </span>
      <span
        v-show="isSelectable"
        :class="[
          'fr-icon-arrow-left-s-line',
          'gps-filters-sidebar-header__icon'
        ]"
      />
    </div>
    <div class="gps-filters-sidebar-content">
      <FilterGroup
        v-for="c in collections"
        :key="c.name"
        :collection="c"
      />
    </div>
  </div>
</template>

<style lang="scss">
.gps-filters-sidebar {
  background-color: white;

  margin-bottom: 1rem;

  h5,
  h6 {
    margin: 0;
  }

  .fr-checkbox-group {
    margin-top: 8px;
  }
}

.gps-filters-sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  font-weight: 700;
  padding: 0.5rem 1rem;
  color: var(--text-active-blue-france);

  >span svg {
    margin-right: 0.5rem;
  }
}

.gps-filters-sidebar-header__icon {
  transform: rotate(0deg);
  transition: transform .2s ease-in-out;
}

.gps-filters-sidebar.open .gps-filters-sidebar-header__icon {
  transform: rotate(-90deg);
}

.gps-filters-sidebar-content {
  display: none;

  padding: 0px 16px 8px;

  >details {
    padding: 8px 0px;
  }
}

.gps-filters-sidebar {

  border: solid 1px var(--border-default-grey);
  border-top: solid 2px var(--text-active-blue-france);

  .gps-filters-sidebar-content {
    display: block;
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

    .gps-filters-sidebar-header {
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

    .gps-filters-sidebar-content {
      display: none;
    }

    &.open {

      border-color: var(--border-default-grey);
      border-top-color: var(--text-active-blue-france);

      .gps-filters-sidebar-header {
        background-color: var(--background-default-grey);
        color: var(--text-active-blue-france);

        &:hover {
          background-color: var(--background-default-grey-hover);
        }

        &:active {
          background-color: var(--background-default-grey-active);
        }
      }

      .gps-filters-sidebar-content {
        display: block;
      }
    }
  }

}
</style>
