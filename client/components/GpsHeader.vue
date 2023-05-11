<script setup lang="ts">

const {
  headerProps,
  mainNavProps,
} = await useGetContent('/header')

const showNavigation = useIsAuthenticated()

</script>

<template>
  <DsfrHeader
    :class="[
      'gps-header'
    ]"
    v-bind="headerProps"
  >
    <DsfrNavigation
      v-if="showNavigation"
      v-bind="mainNavProps"
    />
  </DsfrHeader>
</template>

<style scoped>
.gps-header {
}

</style>
