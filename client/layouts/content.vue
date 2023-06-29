<script setup lang="ts">

const content = await useGetPageContent()

</script>

<template>
  <div>
    <GpsHead
      :title="content?.metaTitle"
      :description="content?.metaDescription"
    />
    <GpsHeader />
    <GpsMain>
      <h1>
        {{ content?.title }}
      </h1>
      <slot />
    </GpsMain>
    <GpsFooter />
  </div>
</template>
