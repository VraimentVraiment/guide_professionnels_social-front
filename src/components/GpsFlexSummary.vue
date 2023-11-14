<template>
  <summary>
    <span :class="$attrs.class">
      <slot />
    </span>
  </summary>
</template>

<style scoped lang="scss">

summary {
  list-style: none;

  &::marker {
    content: "";
    display: none;
  }

  &::-webkit-details-marker {
    display: none;
  }

  &>span {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
