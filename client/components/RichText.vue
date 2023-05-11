<script lang="ts" setup>

defineProps<{
  fieldKey: string;
  fieldLabel: string;
  content: string;
}>()

</script>

<template>
  <div :class="`gps-rich-text-container__${fieldKey}`">
    <h2>{{ fieldLabel }}</h2>
    <div
      class="gps-rich-text"
      :class="[
        'gps-rich-text',
        `gps-rich-text__${fieldKey}`
      ]"
    >
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-html="content" />
    </div>
  </div>
</template>
