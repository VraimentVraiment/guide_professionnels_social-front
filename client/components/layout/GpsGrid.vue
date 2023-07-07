<script setup lang="ts">

defineProps<{
  showTitle: boolean,
}>()

const content = await useGetPageContent()

</script>

<template>
  <div
    :class="[
      'fr-grid-row',
      'fr-grid-row--gutters',
    ]"
  >
    <div
      :class="[
        'fr-col-12',
        'fr-col-md-4',
      ]"
    >
      <h1 v-if="showTitle">
        {{ content?.title }}
      </h1>

      <slot name="top-left" />
    </div>
    <div
      :class="[
        'fr-col-12',
        'fr-col-md-8',
      ]"
    >
      <slot name="top-right" />
    </div>
    <div
      :class="[
        'fr-col-12',
        'fr-col-md-4',
      ]"
    >
      <slot name="bottom-left" />
    </div>
    <div
      :class="[
        'fr-col-12',
        'fr-col-md-8',
      ]"
    >
      <slot name="bottom-right" />
    </div>
  </div>
</template>

<style scoped>

h1 {
  margin-bottom: 0;
}

.fr-grid-row > div {
  position: relative;
}

</style>
