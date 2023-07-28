<script setup lang="ts">

const { footerProps } = await queryContent('/layout').findOne()

</script>

<template>
  <DsfrFooter
    :class="[
      'gps-footer',
      'noprint'
    ]"
    v-bind="footerProps"
  />
</template>

<style scoped>
.gps-footer {
  background: var(--background-default-grey);
}
</style>
