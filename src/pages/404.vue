<script setup lang="ts">

definePageMeta({
  layout: 'default',
})

const content = await queryContent('/pages/404').findOne()

</script>

<template>
  <div class="fr-container">
    <div class="fr-grid-row">
      <div class="fr-col-12">
        <GpsPageTitle />
        <p>{{ content.errorDescription }}</p>
        <p>
          <a href="/">{{ content.returnHomeLabel }}</a>
        </p>
      </div>
    </div>
  </div>
</template>
