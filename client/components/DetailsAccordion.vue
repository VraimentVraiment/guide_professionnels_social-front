<script setup>

defineProps({
  label: {
    type: String,
    required: true,
  },
  summaryTag: {
    type: String,
    default: 'span',
  },
  open: {
    type: Boolean,
    default: false,
  },
});

</script>

<template>
  <details
    class="gps-details"
    :open="open"
  >
    <summary class="gps-details__summary">
      <component
        :is="summaryTag"
        class="gps-details__summary__label"
      >
        {{ label }}
      </component>
      <span
        :class="[
          'gps-details__icon',
          'fr-icon-arrow-left-s-line',
        ]"
        aria-hidden="true"
      />
    </summary>
    <div class="gps-details__content">
      <slot />
    </div>
  </details>
</template>


<style scoped lang="scss">
details.gps-details {
  padding: .5rem 0;

  &:not(:last-child) {
    border-bottom: 1px solid var(--border-default-grey);
  }

  summary.gps-details__summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: .5rem 1rem .5rem .5rem;

    &::-webkit-details-marker {
      display: none;
    }

    &:hover {
      background-color: var(--background-default-grey-hover);
    }

    &:active {
      background-color: var(--background-default-grey-active);
    }

    .gps-details__summary__label {
      display: block;
      margin: 0;
      line-height: 1;
    }

    .gps-details__icon {
      display: block;
      transform: rotate(0deg) scale(0.75);
      transition: transform .2s ease-in-out;
    }
  }

  &[open]>summary.gps-details__summary>.gps-details__icon {
    transform: rotate(-90deg) scale(0.75);
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
