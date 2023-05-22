<script lang="ts" setup>

defineProps<{
  collection: DispositifPost[]
  isListSelected: boolean
}>()

const { breakpoints } = useDsfrBreakpoints()
const isCol6 = breakpoints?.greater('SM')
const isCol4 = breakpoints?.greater('MD')

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
        v-for="{name, id, addresses} in collection"
        :key="id"
        :class="[
          'fr-col-12',
          { 'fr-col-sm-6': isListSelected && isCol6 },
          { 'fr-col-lg-4': isListSelected && isCol4 },
        ]"
      >
        <DispositifCard
          :id="id"
          :name="name"
          :description="formatAddresses(addresses)"
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
