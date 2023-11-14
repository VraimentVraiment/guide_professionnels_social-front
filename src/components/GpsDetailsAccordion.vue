<script setup lang="ts">

withDefaults(defineProps<{
  open?: boolean,
  hasCheckedItems?: boolean
}>(), {
  open: false,
})

</script>

<template>
  <details
    :class="[
      'gps-details'
    ]"
    :open="open"
  >
    <summary
      :class="[
        'gps-details__summary',
        { 'has-checked-items': hasCheckedItems }
      ]"
    >
      <slot name="summary" />
      <v-icon
        :class="[
          'gps-details__icon',
        ]"
        :name="'ri-arrow-left-s-line'"
        aria-hidden="true"
      />
    </summary>
    <div
      :class="[
        'gps-details__content'
      ]"
    >
      <slot name="content" />
    </div>
  </details>
</template>

<style scoped lang="scss">
details.gps-details {
  padding: .5rem 0;
  cursor: initial;

  summary.gps-details__summary {
    display: flex;
    position: relative;
    align-items: center;
    justify-content: space-between;
    list-style: none;
    padding: .5rem 1rem .5rem .5rem;

    &::marker {
      content: "";
      display: none;
    }

    &::-webkit-details-marker {
      display: none;
    }

    &:hover {
      background-color: var(--background-default-grey-hover);
    }

    &:active {
      background-color: var(--background-default-grey-active);
    }

    &.has-checked-items {
      &::after {
        content: '';
        width: 6px;
        height: 6px;
        border-radius: 3px;
        background: var(--text-active-blue-france);
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: -3px;
      }
    }

    .gps-details__icon {
      display: block;
      transform: rotate(270deg);
      transition: transform .3s ease-in-out;
    }
  }

  &[open]>summary.gps-details__summary>.gps-details__icon {
    transform: rotate(90deg);
  }

  >.gps-details__content {
    padding: .5rem 0 .5rem .5rem;
  }

  details.gps-details {
    border: none !important;
    padding: 0 !important;

    >.gps-details__content {
      padding: .5rem;
    }
  }
}
</style>
