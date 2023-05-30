<script setup lang="ts">

definePageMeta({
  layout: 'default',
})

const fichesTechniques = await useFetchDirectusItems<FicheTechniquePost>({
  collectionName: 'gps_fichestechniques',
})

const getCardProps = (ficheTechnique: FicheTechniquePost) => {
  const { name, id } = ficheTechnique
  return {
    title: name,
    link: `/fichestechniques/${id}`,
  }
}

</script>

<template>
  <ClientOnly>
    <GpsPostCardGrid
      v-if="fichesTechniques?.length"
      :collection="fichesTechniques"
      :wrap-cards="true"
      :get-card-props="getCardProps"
    />
  </ClientOnly>
</template>

<style scoped lang="scss">
.fr-grid-row {
  margin: 0;
}
</style>