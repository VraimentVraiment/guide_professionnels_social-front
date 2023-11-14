<script setup lang="ts">

const content = await queryContent('/components/scheme-selection-modal').findOne()

const router = useRouter()

const { preferences } = useGpsSchemeStore()

const {
  isOpen: isModalOpen,
  open: openModal,
  close: closeModal,
} = useModalModel('scheme-selection')

onMounted(() => {
  openModal()
})

const close = () => {
  closeModal()
  router.back()
}

</script>

<template>
  <DsfrModal
    :title="content.schemeSelectionTitle"
    :opened="isModalOpen"
    @close="() => close()"
  >
    <DsfrRadioButtonSet
      :legend="content.schemeSelectionDescription"
      name="scheme-selection"
      :options="[
        {
          value: 'light',
          label: content.lightOptionLabel,
          img : `/pictograms/sun${preferences.theme === 'dark' ? '-dark' : ''}.svg`
        },
        {
          value: 'dark',
          label: content.darkOptionLabel,
          img : `/pictograms/moon${preferences.theme === 'dark' ? '-dark' : ''}.svg`
        },
        {
          value: 'system',
          label: content.systemOptionLabel, hint: content.systemOptionHint,
          img : `/pictograms/system${preferences.theme === 'dark' ? '-dark' : ''}.svg`
        },
      ]"
      :model-value="preferences.scheme ?? 'system'"
      @update:model-value="(event) => {
        preferences.scheme = event as 'light' | 'dark' | 'system'
        close()
      }"
    />
  </DsfrModal>
</template>
