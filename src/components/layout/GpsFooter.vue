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

<style scoped>
.gps-footer {
  background: var(--background-default-grey);
}
</style>
