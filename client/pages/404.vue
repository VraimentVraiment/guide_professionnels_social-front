<script setup lang="ts">

definePageMeta({
  layout: 'default',
})

const {
  errorTitle,
  errorDescription,
  returnHomeLabel,
} = await useGetContent('/404')

</script>

<template>
  <div class="fr-container">
    <div class="fr-grid-row">
      <div class="fr-col-12">
        <h1>{{ errorTitle }}</h1>
        <p>{{ errorDescription }}</p>
        <p>
          <a href="/">{{ returnHomeLabel }}</a>
        </p>
      </div>
    </div>
  </div>
</template>
