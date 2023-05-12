<script lang="ts" setup>

defineProps<{
  collection: DispositifPost[]
  isListSelected: boolean
}>()

const { breakpoints } = useDsfrBreakpoints()
const isCol6 = breakpoints?.greater('SM')
const isCol4 = breakpoints?.greater('MD')

const formatAddresses = (addresses) => {
  return addresses
    ?.map(({ address }) => {
      return address.text
    })
    ?.join(', ')
}
</script>

<template>
  <div
    v-if="collection.length"
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
        v-for="d in collection"
        :key="d.id"
        :class="[
          'fr-col-12',
          { 'fr-col-sm-6': isListSelected && isCol6 },
          { 'fr-col-lg-4': isListSelected && isCol4 },
        ]"
      >
        <DispositifCard
          :id="d.id"
          :name="d.name"
          :description="formatAddresses(d.addresses)"
        />
      </div>
    </div>
  </div>

  <p v-else>
    Aucun dispositif
  </p>
</template>

<style scoped lang="scss">
.gps-card-grid {
  padding: 1px;
  overflow: hidden;
}
</style>
<style lang="scss">
.gps-card-grid {
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
