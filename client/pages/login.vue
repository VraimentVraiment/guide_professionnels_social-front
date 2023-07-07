<script setup lang="ts">

definePageMeta({
  layout: 'default',
})

</script>

<template>
  <div
    :class="[
      'gps-login-container',
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
@import "@/styles";

.gps-login-container {
  margin-top: -2rem;

  @include lg {
    margin-top: 0;
  }

  @include xl {
    margin-top: 4vh;
  }
}
</style>
