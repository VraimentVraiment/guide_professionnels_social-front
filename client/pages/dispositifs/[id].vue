<script setup lang="ts">

definePageMeta({
  layout: 'dispositif',
})

const id = parseInt(useRoute().params.id as string, 10)

const dispositif = await useFetchDirectusItem<DispositifPost>({
  collectionName: 'dispositifs',
  id,
})

if (!dispositif) {
  navigateTo('/404')
}

const richTextFields = inject('richTextFields')

</script>

<template>
  <GpsHead
    :page-content="{
      title: dispositif?.name,
      metaTitle: dispositif?.name,
    }"
  />
  <DateUpdated
    v-if="dispositif?.date_updated.length"
    :date-updated="dispositif.date_updated"
  />
  <template
    v-for="({ key, label }) in richTextFields"
    :key="key"
  >
    <RichTextContainer
      v-if="dispositif?.[key]"
      :field-key="key"
      :field-label="label"
      :content="dispositif[key]"
    />
  </template>
</template>
