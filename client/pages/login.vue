<script setup lang="ts">

definePageMeta({
  layout: 'default',
})

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
        'fr-col-sm-10',
        'fr-col-md-8',
        'fr-col-lg-6',
        'fr-col-offset-sm-1',
        'fr-col-offset-md-2',
        'fr-col-offset-lg-3',
      ]"
    >
      <GpsSiteBanner />
      <GpsAuthForm />
    </div>
  </div>
</template>

<style scoped lang="scss">

.gps-auth {
  background-color: var(--background-default-grey);
  border: solid 1px var(--border-default-grey);
  box-shadow: 0 6px 18px 0 rgb(0 0 18 / 16%) !important;
  padding: 2rem;

  .gps-auth--error .fr-input-group {
    animation: shake 0.6s cubic-bezier(.36, .07, .19, .97) both;
  }
}
</style>
