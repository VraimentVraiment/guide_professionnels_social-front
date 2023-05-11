<script lang="ts" setup>

defineProps<{
  collection: DispositifPost[]
}>()

</script>

<template>
  <div
    v-if="collection.length"
    class="gps-card-grid"
  >
    <DispositifCard
      v-for="d in collection"
      :id="d.id"
      :key="d.id"
      :name="d.name"
    />
  </div>
  <p v-else>
    Aucun dispositif
  </p>
</template>

<style scoped lang="scss">
.gps-card-grid {
  padding: 1px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 1rem;
}
</style>
