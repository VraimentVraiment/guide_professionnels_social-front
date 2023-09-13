<script setup lang="ts">

const content = await queryContent('/components/footer').findOne()

</script>

<template>
  <DsfrFooter
    :class="[
      'gps-footer',
      'noprint'
    ]"
    v-bind="content.props"
  />
</template>

<style>
/*
 * Fix logo size
 * 'operatorImgStyle' footer prop sometimes gets overriden by the default style
 */
.gps-footer .fr-footer__logo {
  max-width: 21.5rem !important;
}
</style>

<style scoped>
.gps-footer {
  background: var(--background-default-grey);
}
</style>
