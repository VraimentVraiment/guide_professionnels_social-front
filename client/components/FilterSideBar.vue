<script setup lang="ts">

defineProps<{
  collections: FiltersCollection[]
}>()

</script>

<template>
  <div class="gps-filters-sidebar">
    <div class="gps-filters-sidebar-header">
      <h3>Filtrer</h3>
    </div>
    <div class="gps-filters-sidebar-content">
      <FilterGroup v-for="c in collections" :key="c.name" :collection="c" />
    </div>
  </div>
</template>

<style>
.gps-filters-sidebar {
  background-color: white;
  padding: 1rem;
  border: solid 1px var(--border-default-grey);
  box-shadow: 0 0 0 1px var(--border-default-grey);
  margin-bottom: 1rem;
  &.open {
    margin-bottom: 0;
  }
}

.gps-filters-sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  display: block;

  & h3 {
    margin: 0;
  }
}

.gps-filters-sidebar-content {
  display: none;
}

.gps-filters-sidebar.open {

  .gps-filters-sidebar-header {
    display: none;
  }

  .gps-filters-sidebar-content {
    display: block;
  }
}
</style>
