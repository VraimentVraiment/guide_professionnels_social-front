<script setup lang="ts" generic="PostType extends Post">

defineProps<{
  collection: PostType[]
  wrapCards: boolean
  type: 'link' | 'file'
  getCardProps:(item: PostType) => {
    title: string
    link?: string
    description?: string
    format?: string
    size?: string
    href?: string
    block?: boolean
  }
}>()

const { breakpoints } = useDsfrBreakpoints()
const isCol6 = breakpoints?.greater('SM')
const isCol4 = breakpoints?.greater('MD')

</script>

<template>
  <div
    :class="[
      'gps-card-grid',
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

<style lang="scss">
.gps-card-grid {
  padding: 1px;
  overflow: hidden;

  .fr-card__title {
    margin: 0 !important;
  }

  .fr-card__img {
    display: none !important;
  }

  .fr-card__detail {
    display: none !important;
  }

  .fr-card__body {
    padding: 0 1.5rem;

    .fr-card__title {
      font-size: 1.2rem;
      line-height: 1.5;
      margin-top: 1.5rem;
    }
  }
}
</style>
