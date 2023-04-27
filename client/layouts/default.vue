<script setup lang="ts">

</script>

<template>
  <GpsHeader />
  <GpsMain>
    <GpsHead />
    <slot />
  </GpsMain>
  <GpsFooter />
</template>

<style>

body {
  background-color: var(--background-alt-grey)
}

</style>
