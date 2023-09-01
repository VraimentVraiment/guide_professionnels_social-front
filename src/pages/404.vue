<script setup lang="ts">

definePageMeta({
  layout: 'default',
})

const content = await queryContent('/404').findOne()

</script>

<template>
  <div class="fr-container">
    <div class="fr-grid-row">
      <div class="fr-col-12">
        <h1>{{ content.errorTitle }}</h1>
        <p>{{ content.errorDescription }}</p>
        <p>
          <a href="/">{{ content.returnHomeLabel }}</a>
        </p>
      </div>
    </div>
  </div>
</template>
