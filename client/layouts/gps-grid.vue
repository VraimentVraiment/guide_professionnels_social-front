<script setup lang="ts">

</script>

<template>
  <GpsHeader />
  <GpsMain>
    <GpsHead />
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
          'fr-col-lg-4', 
          'fr-col-xl-4',
        ]"
      >
        <slot name="topleft" />
      </div>
      <div 
        :class="[
          'fr-col-12',
          'fr-col-md-8',
          'fr-col-lg-8', 
          'fr-col-xl-8',
        ]"
      >
        <slot name="top-right" />
      </div>
      <div
        :class="[
          'fr-col-12',
          'fr-col-md-4',
          'fr-col-lg-4', 
          'fr-col-xl-4',
        ]"
      >
        <slot name="bottom-left" />
      </div>
      <div
        :class="[
          'fr-col-12',
          'fr-col-md-8',
          'fr-col-lg-8', 
          'fr-col-xl-8',
        ]"
      >
        <slot name="bottom-right" />
      </div>
    </div>
  </GpsMain>
  <GpsFooter />
</template>

<style>

body {
  background-color: var(--background-alt-grey)
}

</style>
