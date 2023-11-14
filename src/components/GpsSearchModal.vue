<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core'

const props = defineProps<{
  model: {
    isOpen: Ref<boolean>
    open:() => void
    close: () => void
  }
}>()

const container = ref(null)

onClickOutside(container, () => {
  props.model.close()
})

</script>

<template>
  <div
    v-if="model.isOpen.value"
    ref="container"
    :class="[
      'gps-search__modal',
      'fr-p-2w',
      'fr-mb-2w',
    ]"
  >
    <slot />
    <DsfrButton
      :class="[
        'gps-search__close-button'
      ]"
      type="buttonType"
      :label="'Fermer'"
      tertiary
      size="small"
      icon="ri-close-line"
      no-outline
      icon-right
      @click="() => model.close()"
    />
  </div>
</template>

<style scoped lang="scss">
  .gps-search__modal {
    border: 1px solid var(--border-default-grey);
    background-color: var(--background-default-grey);
    filter: drop-shadow(var(--overlap-shadow));
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    z-index: 1000;

    .gps-search__close-button {
      position: absolute;
      top: .25rem;
      right: .25rem;
      max-width: none !important;

      &::before {
        display: none !important;
      }
    }
  }
</style>
