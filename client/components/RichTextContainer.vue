<script lang="ts" setup>

defineProps<{
  fieldKey: string;
  fieldLabel: string;
  content: string;
}>()

</script>

<template>
  <div :class="`gps-rich-text-container--${fieldKey}`">
    <h2>{{ fieldLabel }}</h2>
    <RichText
      :content="content"
      :class="`gps-rich-text--${fieldKey}`"
    />
  </div>
</template>
