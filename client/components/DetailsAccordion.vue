<script setup>

defineProps({
  label: {
    type: String,
    required: true,
  },
  summaryTag: {
    type: String || null,
    default: null,
  },
});

</script>

<template>
  <details>
    <summary>
      <component
        :is="summaryTag || 'span'"
      >
        {{ label }}
      </component>
      <span
        class="fr-icon-arrow-left-s-line gps-filter-details__icon"
        aria-hidden="true"
      />
    </summary>
    <slot />
  </details>
</template>


<style scoped lang="scss">

details {
  user-select: none;
  box-sizing: border-box;
  display: block;
  margin: 0;

  &:not(:last-child) {
    border-bottom: 1px solid var(--border-default-grey);
  }
}

summary {
  // padding: .5rem 2rem .5rem .75rem;
  padding: 8px, 16px, 8px, 8px;
  border-bottom: 1px solid #fff;
  position: relative;
  box-sizing: border-box;
  display: block;
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: space-between;

  > h5, > h6 {
    float: left;
  }

  summary::-webkit-details-marker {
    display: none;
  }
  > * {
    margin: 0;
  }
}

.gps-filter-details__icon {
  display: block;
  transform: rotate(0deg) scale(0.75);
  transition: transform .2s ease-in-out;
}
details[open]>summary>.gps-filter-details__icon  {
  transform: rotate(-90deg) scale(0.75);
}

details details {
  margin-left: 8px;
  padding: 8px 0 8px 8px;
  border: none !important;
}
</style>

<style lang="scss">
details > *:not(summary) {
  // margin: 0.5rem 0 1rem .75rem;
  // padding: 0 0 0 .5rem;
}
</style>
