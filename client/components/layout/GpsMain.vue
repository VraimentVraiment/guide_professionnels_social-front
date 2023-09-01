<script lang="ts" setup>
/**
 * @todo Render some parts of main on the server
 * Right know it causes issues with the global auth middleware
 * and the rendered layout
 */
</script>

<template>
  <main
    :class="[
      'fr-container'
    ]"
  >
    <ClientOnly>
      <slot />
    </ClientOnly>
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
