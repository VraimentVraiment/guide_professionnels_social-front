<script setup lang="ts">

</script>

<template>
  <div
    :class="[
      'fr-grid-row',
      'fr-grid-row--gutters',
    ]"
  >
    <div
      :class="[
        'fr-mb-12v',
        'fr-col-12',
        'fr-col-md-4',
      ]"
    >
      <slot name="left" />
    </div>
    <div
      :class="[
        'fr-col-12',
        'fr-col-md-8',
      ]"
    >
      <slot name="right" />
    </div>
  </div>
</template>

<style scoped>

.fr-grid-row > div {
  position: relative;
}

</style>
