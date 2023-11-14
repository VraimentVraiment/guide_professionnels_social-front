<script setup lang="ts" generic="PostType extends GpsPost">

import { DsfrCard, DsfrFileDownload } from '@gouvminint/vue-dsfr'

defineProps<{
  collection: PostType[]
  type: 'link' | 'file'
  getCardProps:(item: PostType) => typeof DsfrCard | typeof DsfrFileDownload
}>()

const container = ref<HTMLDivElement | null>(null)

defineExpose({
  scrollTop: () => {
    if (container.value) {
      container.value.scrollTop = 0
    }
  },
})

</script>

<template>
  <div
    ref="container"
    :class="[
      'fr-container-fluid',
    ]"
  >
    <div
      :class="[
        'fr-grid-row',
        'fr-grid-row--gutters',
      ]"
    >
      <div
        v-for="item, i in collection"
        :key="i"
        :class="[
          'fr-col-12',
          'fr-col-sm-6',
          'fr-col-lg-4',
        ]"
      >
        <component
          :is="type === 'file' ? 'DsfrFileDownload' : 'DsfrCard'"
          v-bind="getCardProps(item)"
        />
      </div>
    </div>
  </div>
</template>
