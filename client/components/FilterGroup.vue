<script lang="ts" setup>

const props = defineProps<{
  collection: FiltersCollection
}>()

const rootNode = stratifyFilters(props.collection)

const checkedItems = computed(() => {
  return props.collection.items
    .filter(item => item.checked)
})

</script>

<template>
  <h2>{{ checkedItems.length }}</h2>
  <div
    v-if="rootNode"
    class="filter-group"
  >
    <h2>{{ collection.label }}</h2>
    <FilterNode
      :node="rootNode"
      :collection-name="collection.name"
    />
  </div>
</template>

<style scoped>
.filter-group {
  display: block;
}
</style>
