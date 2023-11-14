<script setup lang="ts">

const { getTitle } = useGetPageContent()
const title = computed(getTitle)

</script>

<template>
  <h1 v-if="title">
    {{ title }}
  </h1>
</template>
