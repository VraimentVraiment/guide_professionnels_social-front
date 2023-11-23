<script setup lang="ts">

/**
 * @todo We should use the DsfrSchemeSelectionModal directly in app.vue
 * Right now, we need to have a dedicated page because DsfrHeader quicklinks
 * must change routes when clicked.
 */

const router = useRouter()

</script>

<template>
  <DsfrSchemeSelectionModal
    @close="() => router.back()"
  />
</template>
