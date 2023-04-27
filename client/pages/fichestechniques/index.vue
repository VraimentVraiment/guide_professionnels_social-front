<script setup lang="ts">

definePageMeta({
  layout: 'default',
})

const fichesTechniques = await useFetchDirectusItems<FicheTechniquePost>({
  collectionName: 'fiches_techniques',
})

</script>

<template>
  <div>
    <FicheTechniqueCard
      v-for="f in fichesTechniques"
      :key="f.id"
      :fiche-technique="f"
    />
  </div>
</template>
