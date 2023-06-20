<script lang="ts" setup>
</script>
<template>
  <main class="fr-container">
    <slot />
  </main>
</template>

<style lang="scss">
body {
  background-color: var(--background-alt-grey);
}

main.fr-container {
  padding-top: 4rem;
  padding-bottom: 4rem;
  min-height: 50vh
}

h1 {
  margin-top: 0;
}
</style>
