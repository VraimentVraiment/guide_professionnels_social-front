<script setup lang="ts">

const props = withDefaults(defineProps<{
  startOpen?: boolean,
  hasActiveContent?: boolean
}>(), {
  startOpen: false,
})

const isOpen = ref(props.startOpen)

</script>

<template>
  <details
    :class="[
      'gps-details',
    ]"
    :open="isOpen"
  >
    <GpsFlexSummary
      :class="[
        'gps-details__summary',
        { 'has-active-content': hasActiveContent }
      ]"
      @click.prevent="() => isOpen = !isOpen"
    >
      <slot name="summary" />
      <v-icon
        :class="[
          'gps-details__icon',
          { 'open': isOpen }
        ]"
        :name="'ri-arrow-left-s-line'"
        aria-hidden="true"
      />
    </GpsFlexSummary>
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

  .gps-details__summary {
    position: relative;
    padding: .5rem 1rem .5rem .5rem;

    &:hover {
      background-color: var(--background-default-grey-hover);
    }

    &:active {
      background-color: var(--background-default-grey-active);
    }

    .gps-details__icon {
      display: block;
      transition: transform .3s ease-in-out;
      transform: rotate(270deg);

      &.open {
        transform: rotate(90deg);
      }
    }
  }

  .has-active-content::after {
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
