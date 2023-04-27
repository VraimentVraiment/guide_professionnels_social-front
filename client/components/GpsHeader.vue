<script setup lang="ts">

const {
  headerProps,
  mainNavProps,
} = await useGetContent('/header')

const showNavigation = useIsAuthenticated()

const search = useGpsSearch()

</script>

<template>
  <DsfrHeader
    v-model="search.query.value"
    :class="['gps-header']"
    v-bind="headerProps"
    show-search
    @search="search.submit()"
  >
    <DsfrNavigation
      v-if="showNavigation"
      v-bind="mainNavProps"
    />
  </DsfrHeader>
</template>

<style scoped>
.gps-header {
  background: var(--background-default-grey);
}

nav.fr-nav {
  margin-bottom: 2rem;
  background: var(--background-default-grey);
  box-shadow: solid 0 0 0 12px var(--dsfr-color-border--light);
}
</style>
