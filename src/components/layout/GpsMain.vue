<script lang="ts" setup>

</script>

<template>
  <main
    :class="[
      'fr-container'
    ]"
  >
    <slot />
  </main>
</template>

<style lang="scss">
@import '@/styles/';

main.fr-container {
  min-height: 80vh;
  padding: 3rem 1rem;

  @include md {
    padding: 4rem 2rem;
  }

  @include lg {
    padding: 6rem 2rem;
  }
}
</style>
