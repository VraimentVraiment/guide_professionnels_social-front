<script lang="ts" setup>

defineProps<{
  collection: DispositifPost[]
  isListSelected: boolean
}>()
const { breakpoints } = useDsfrBreakpoints()
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
          {'fr-col-sm-6': isListSelected && breakpoints.greater('SM')},
          {'fr-col-lg-4': isListSelected && breakpoints.greater('MD')},
        ]"
      >
        <DispositifCard
          :id="d.id"
          :name="d.name"
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
