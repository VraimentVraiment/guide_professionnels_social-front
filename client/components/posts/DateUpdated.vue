<script setup lang="ts">

defineProps<{
  dateUpdated: string;
}>()

const getDate = (date: string) => {
  const dateObj = new Date(date)
  return dateObj.toLocaleDateString('fr-FR')
}

</script>

<template>
  <p class="fr-text--sm gps-date">
    Dernière mise à jour le
    {{ getDate(dateUpdated) }}
  </p>
</template>
