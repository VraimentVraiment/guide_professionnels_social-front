<template>
  <div
    :class="[
      'fr-grid-row',
      'fr-grid-row--gutters',
      'fr-mt-n8v',
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
