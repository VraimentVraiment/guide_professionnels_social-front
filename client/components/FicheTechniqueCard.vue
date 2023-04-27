<script setup lang="ts">

defineProps<{
  ficheTechnique: FicheTechniquePost
}>()

</script>

<template>
  <DsfrCard
    :title="ficheTechnique.name"
    :link="`/fichestechniques/${ficheTechnique.id}`"
  />
</template>
