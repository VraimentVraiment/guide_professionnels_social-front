<script setup lang="ts">

const content = await queryContent('/layout').findOne()

</script>

<template>
  <DsfrFooter
    :class="[
      'gps-footer',
      'noprint'
    ]"
    v-bind="content.footerProps"
  />
</template>

<style scoped>
.gps-footer {
  background: var(--background-default-grey);
}
</style>
