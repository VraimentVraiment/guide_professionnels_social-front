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
    <div
      class="gps-details__content"
    >
      <slot />
    </div>
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

  > h2 {
    padding: 0;
    margin: 0;
    line-height: 1;
  }
  > h5, > h6 {
    float: left;
  }

  &:hover {
    background-color: var(--background-default-grey-hover);
  }

  &:active {
    background-color: var(--background-default-grey-active);
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
  border: none !important;
  
  > summary {
    padding: .5rem 1rem .5rem .5rem;
  }

  > .gps-details__content {
    padding: .5rem;
  }
}
</style>

<style lang="scss">
details > *:not(summary) {
}

details .gps-details__content {
  > h5, > h6 {
    &:not(:first-child) {
      margin-top: .75rem;
    }
  }
}
</style>
