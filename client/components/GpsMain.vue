<script lang="ts" setup>
</script>
<template>
  <main class="fr-container">
    <slot />
  </main>
</template>

<style scoped lang="scss">
main.fr-container {
  padding-top: 4rem;
  padding-bottom: 4rem;
  min-height: 50vh
}
</style>
<style lang="scss">
body {
  background-color: var(--background-alt-grey);
}
h1 {
  margin-top: 0;
}
</style>
