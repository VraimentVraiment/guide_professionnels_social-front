<script lang="ts" setup>

import DetailsAccordion from '@/components/DetailsAccordion.vue'

defineProps<{
  collection: FiltersCollection
}>()

</script>

<template>
  <DetailsAccordion
    v-if="collection.rootNode"
    class="filter-group"
    :label="collection.label"
    :summary-tag="'h2'"
  >
    <FilterNode
      :node="collection.rootNode"
    />
  </DetailsAccordion>
</template>

<style scoped lang="scss">
.filter-group {
  display: block;
}
</style>
<style lang="scss">
.filter-group {
  display: block;

  label {
    font-size: 14px !important;
  }
  h2 {
    font-size: 18px;
    font-weight: 700;
  }
  h5 {
    font-size: 1rem;
    font-weight: 700;
    line-height: 1;
    margin-bottom: .5rem !important;
  }
  h6 {
    font-size: 1rem;
    font-weight: 400;
    line-height: 1;
  }
}
</style>
