<script setup lang="ts">

defineProps <{
  collections: FiltersCollection[]
}>()

</script>

<template>
  <div
    class="gps-filters-sidebar"
  >
    <FilterGroup
      v-for="c in collections"
      :key="c.name"
      :collection="c"
    />
  </div>
</template>

<style>
.gps-filters-sidebar {
  background-color: white;
  display: inline-block;
    float: left;
  max-width: 300px;
  max-width: 30%;
  margin-bottom: 2rem;
  margin-right: 2rem;
  padding: 1rem;
  border: solid 1px var(--border-default-grey);
  box-shadow: 0 0 0 1px var(--border-default-grey);
}
</style>
