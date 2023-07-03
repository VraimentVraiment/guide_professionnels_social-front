<script setup lang="ts">

const {
  headerProps,
  mainNavProps,
} = await useGetContent('/layout')

const showNavigation = useIsAuthenticated()

</script>

<template>
  <DsfrHeader
    :class="[
      'gps-header',
      'noprint'
    ]"
    v-bind="headerProps"
  >
    <DsfrNavigation
      v-if="showNavigation"
      v-bind="mainNavProps"
    />
  </DsfrHeader>
</template>
