<script setup lang="ts">

const { footerProps } = await useGetContent('/footer')

</script>

<template>
  <DsfrFooter
    :class="['gps-footer']"
    v-bind="footerProps"
  />
</template>

<style scoped>
.gps-footer {
  background: var(--background-default-grey);
}
</style>
