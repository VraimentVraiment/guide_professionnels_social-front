<script setup lang="ts">

const props = defineProps<{
  id: number;
  name: string;
}>()

</script>

<template>
  <DsfrCard
    :title="props.name"
    :link="`/dispositifs/${id}`"
    :class="['gps-card--dispositif']"
  />
</template>

<style>
.fr-card__img {
  display: none !important;
}

.fr-card__detail {
  display: none !important;
}
</style>
