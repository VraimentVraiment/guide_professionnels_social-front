<script setup lang="ts">

definePageMeta({
  layout: 'default',
})

const fichesTechniques = await useFetchDirectusItems<FicheTechniquePost>({
  collectionName: 'fiches_techniques',
})

</script>

<template>
  <div
    :class="[
      'fr-grid-row',
      'fr-grid-row--gutters',
    ]"
  >
    <div
      v-for="f in fichesTechniques"
      :key="f.id"
      :class="[
        'fr-col-12',
        'fr-col-md-6',
        'fr-col-lg-4',
        'fr-col-xl-3',
      ]"
      :fiche-technique="f"
    >
      <FicheTechniqueCard
        :fiche-technique="f"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
  .fr-grid-row {
    margin: 0;
  }
</style>