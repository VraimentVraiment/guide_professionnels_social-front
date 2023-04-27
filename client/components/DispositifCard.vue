<script setup lang="ts">

const props = defineProps<{
  id: number;
  name: string;
}>()

// const description = 'Description par défaut'
const link = `/dispositifs/${props.id}`

</script>

<template>
  <DsfrCard
    :title="props.name"
    :link="link"
    :class="['gps-card--dispositif']"
  />
</template>

<style>
.fr-card__img {
  display: none !important;
}
</style>
