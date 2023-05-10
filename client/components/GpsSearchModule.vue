<script lang="ts" setup>
// defineProps<{

//  }>();

const search = useGpsSearch()

</script>

<template>
  <DsfrSearchBar
    v-model="search.query.value"
    :class="['gps-search']"
    label="Rechercher"
    placeholder="Rechercher un mot, une expression, une référence..."
    large
    @search="search.submit()"
  />
</template>

<style scoped lang="scss">
.gps-search {
  margin-bottom: 2rem;
}
</style>
