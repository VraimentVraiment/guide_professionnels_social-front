<script lang="ts" setup>

defineProps<{
  content: string;
}>()

</script>

<template>
  <article class="gps-rich-text">
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-html="content" />
  </article>
</template>
