<script setup lang="ts">

import { useEventListener } from '@vueuse/core'

const content = await queryContent('/components/scheme-selection-modal').findOne()

const {
  isOpen: isModalOpen,
  open,
  close,
} = useModalModel('scheme-selection')

const { preferences } = useGpsSchemeStore()

onMounted(() => {
  useEventListener(document.querySelector('.gps-scheme-selection'), 'click', (event: Event) => {
    event.preventDefault()
    open()
  })
})

</script>

<template>
  <DsfrModal
    :title="content.schemeSelectionTitle"
    icon="ri-contrast-2-line"
    :opened="isModalOpen"
    @close="() => close()"
  >
    <DsfrRadioButtonSet
      :legend="content.schemeSelectionDescription"
      name="scheme-selection"
      :options="[
        { value: 'light', label: content.lightOptionLabel },
        { value: 'dark', label: content.darkOptionLabel },
        { value: 'system', label: content.systemOptionLabel, hint: content.systemOptionHint },
      ]"
      :model-value="preferences.scheme ?? 'system'"
      @update:model-value="(event) => {
        preferences.scheme = event as 'light' | 'dark' | 'system'
        close()
      }"
    />
  </DsfrModal>
</template>
