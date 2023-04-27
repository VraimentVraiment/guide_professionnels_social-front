<script setup lang="ts">

const { richTextFields }: {
  key: RichTextKey,
  label: string,
}[] = await useGetContent('/dispositif')

provide('richTextFields', richTextFields)

</script>

<template>
  <GpsHeader />
  <GpsMain>
    <slot />
  </GpsMain>
  <GpsFooter />
</template>
