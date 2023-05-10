<script lang="ts" setup>

import DetailsAccordion from '@/components/DetailsAccordion.vue'

const props = defineProps<{
  collection: FiltersCollection
}>()

const rootNode = stratifyFilters(props.collection)

</script>

<template>
  <DetailsAccordion
    v-if="rootNode"
    class="filter-group"
    :label="collection.label"
    :summary-tag="'h2'"
  >
    <FilterNode
      :node="rootNode"
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
    font-size: 16px;
    font-weight: 700;
    margin-top: 12px !important;
    margin-bottom: 8px !important;
  }
  h6 {
    font-size: 16px;
    font-weight: 400;
  }
}
</style>
