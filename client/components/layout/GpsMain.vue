<template>
  <main class="fr-container">
    <slot />
  </main>
</template>

<style lang="scss">
@import '@/styles/';

body {
  background-color: var(--background-alt-grey);
}

main.fr-container {
  min-height: 80vh;
  padding: 3rem 1rem;

  @include md {
    padding: 4rem 2rem;
  }

  @include lg {
    padding: 6rem 2rem;
  }

  @include xl {
    padding: 8rem 2rem;
  }
}
</style>
