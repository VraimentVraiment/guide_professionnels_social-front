<script setup lang="ts" generic="PostType extends GpsPost">

import { DsfrCard, DsfrFileDownload } from '@gouvminint/vue-dsfr'

defineProps<{
  collection: PostType[]
  wrapCards: boolean
  type: 'link' | 'file'
  getCardProps:(item: PostType) => typeof DsfrCard | typeof DsfrFileDownload
}>()

const { breakpoints } = useDsfrBreakpoints()
const isCol6 = breakpoints?.greater('SM')
const isCol4 = breakpoints?.greater('MD')

</script>

<template>
  <div
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
          { 'fr-col-sm-6': wrapCards && isCol6 },
          { 'fr-col-lg-4': wrapCards && isCol4 },
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
