<script setup lang="ts">

const props = defineProps({
  error: Object,
})

const handleError = () => clearError({ redirect: '/' })

/**
 * to test the error page, copy this code in a page
 */
// throw createError({
//   statusCode: 500,
//   statusMessage: 'Page Not Found',
//   data: {
//     myCustomField: true,
//   },
//   fatal: true,
// })
</script>

<template>
  <div>
    <GpsHeader id="site-header" />
    <GpsMain id="site-main">
      <h1
        class="fr-title"
      >
        Erreur {{ error?.statusCode }}
      </h1>
      <DsfrButton
        label="Retour à l'accueil"
        icon="ri-arrow-left-line"
        tertiary
        no-outline
        @click="handleError"
      />
    </GpsMain>
    <GpsFooter id="site-footer" />
  </div>
</template>
