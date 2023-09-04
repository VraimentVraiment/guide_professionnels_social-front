<script setup lang="ts">

const props = withDefaults(defineProps<{
  postStore: ReturnType<typeof useDispositifPostStore | typeof useFicheTechniquePostStore>
  makeUnselectable: boolean
  maxHeight: string
  openDetails: string[] | null
  id: string
}>(), {
  makeUnselectable: false,
  maxHeight: 'none',
  openDetails: null,
})

const isOpen = ref(false)

const { breakpoints } = useDsfrBreakpoints()
const isSmallScreen = breakpoints.smaller('MD')

const isSelectable = computed(() => {
  return (
    !props.makeUnselectable ||
    isSmallScreen.value
  )
})

const content = await queryContent('/components/gps-filter-sidebar').findOne()
const {
  resetCollection,
  hasCollectionCheckedItems,
} = useCheckedItemsObserver(computed(() => {
  return props.postStore.checkedItems
    ?.filter((collectionCheckedItems) => {
      return collectionCheckedItems.collectionName !== 'gps_thematiques'
    })
}))

</script>

<template>
  <div
    :id="id"
    :class="[
      'gps-filters-sidebar',
      { 'open': isOpen },
      { 'is-small-screen': isSmallScreen },
      { 'is-selectable': isSelectable },
    ]"
  >
    <button
      :class="[
        'gps-filters-sidebar__header'
      ]"
      :aria-expanded="isSelectable ? isOpen : undefined"
      :aria-controls="isSelectable ? `${id}-content` : undefined"
      :aria-disabled="!isSelectable"
      :disabled="!isSelectable"
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
        {{ content.headerLabel }}
      </span>
      <v-icon
        v-show="isSelectable"
        :class="[
          'gps-filters-sidebar__header__icon',
        ]"
        :name="isOpen ? 'ri-close-line' : 'ri-arrow-left-s-line'"
        aria-hidden="true"
      />
    </button>
    <div
      :id="`${id}-content`"
      :class="[
        'gps-filters-sidebar__content'
      ]"
      :style="{
        maxHeight: maxHeight,
      }"
    >
      <GpsDetailsAccordion
        v-for="{ collectionName, label } in postStore.filtersCollections"
        :key="collectionName"
        :class="[
          'filter-group'
        ]"
        :label="label"
        :summary-tag="'h2'"
        :open="openDetails?.includes(collectionName)"
      >
        <DsfrButton
          v-show="hasCollectionCheckedItems(collectionName)"
          :class="[
            'gps-filters-sidebar__reset-button',
          ]"
          :label="content.resetLabel"
          tertiary
          no-outline
          size="small"
          :icon="'ri-close-circle-line'"
          icon-right
          @click="() => resetCollection(collectionName)"
        />
        <FilterNode
          :post-store="postStore"
          :node="postStore.rootNodes.find(node => node?.data.name === collectionName) ?? null"
          is-root-node
        />
      </GpsDetailsAccordion>
    </div>
  </div>
</template>

<style scoped lang="scss">
.gps-filters-sidebar {
  background-color: white;
  border: solid 1px var(--border-default-grey);
  border-top: solid 2px var(--text-active-blue-france);
  padding-bottom: 3px;

  .gps-filters-sidebar__header {
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
    font-size: 1rem;
    font-weight: 700;
    padding: 0.45rem 1rem;
    color: var(--text-active-blue-france);
    cursor: initial;

    .gps-filters-sidebar__header__icon {
      transform: rotate(0deg) scale(1.2);
      transition: transform .2s ease-in-out;
    }

    >span svg {
      margin-right: 0.5rem;
    }
  }

  .gps-filters-sidebar__content {
    padding: 0 1rem .5rem;
    overflow-y: auto;
  }

  &.is-selectable {
    border-color: var(--background-action-low-blue-france);
    border-top-color: var(--background-action-low-blue-france);
    padding-bottom: 0;

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

    &.is-selectable {
      position: absolute;
      z-index: 10;
      width: 100%;

      &.open {
        box-shadow: 0 6px 18px 0 rgb(0 0 18 / 16%) !important;
      }

      .gps-filters-sidebar__content {
        background: var(--background-default-grey);
      }
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
          transform: rotate(-90deg) scale(1.2);
        }
      }

      .gps-filters-sidebar__content {
        display: block;
      }
    }
  }
}

.gps-filters-sidebar__reset-button {
  transform: translate(-0.5rem, -0.5rem);
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
