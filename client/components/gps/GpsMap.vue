<script lang="ts" setup>

const props = defineProps<{
  collection: Post[]
}>()

const emit = defineEmits(['map-loaded'])

const { options: GEOPORTAL_CONFIG } = await useGetContent('/geoportal-config')

const searchStore = useSearchStore()

const markers = computed(() => {
  return props.collection
    .flatMap((post) => {
      return post.addresses
        ?.filter((address) => {
          if (!searchStore.selectedCityList?.length) {
            return true
          }
          return searchStore.selectedCityList?.includes(address.address?.value?.properties?.city)
        })
        ?.map(geojsonAddressToMarkerOptions(post, GEOPORTAL_CONFIG.center.projection))
    })
    .filter(Boolean)
})

if (process.client) {
  import('@ignf-geoportal/sdk-2d')
    .then(loadMap)
}

function loadMap (Gp: any) {
  const gpMap = Gp.Map.load('map', {
    ...GEOPORTAL_CONFIG,
    layersOptions: {
      'GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2': {},
    },
    mapEventsOptions: {
      mapLoaded: onMapLoaded,
    },
  })

  function onMapLoaded () {
    emit('map-loaded')
    watchEffect(() => {
      gpMap.setMarkersOptions(markers.value)
    })
  }
}

</script>

<template>
  <div id="map" />
</template>

<style scoped lang="scss">
#map {
  width: 100%;
  height: 600px;
}
</style>

<style lang="scss">
.gp-feature-info-div {
  padding: 1rem 1.5rem !important;
  box-shadow: 0 6px 18px 0 rgb(0 0 18 / 16%) !important;
  border-radius: 0 !important;
  border: solid 1px var(--border-default-grey) !important;
}
</style>
