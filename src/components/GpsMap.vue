<script lang="ts" setup>

const props = defineProps<{
  collection: GpsLocalizedPost[]
}>()

const emit = defineEmits(['map-loaded'])

const { geoportalConfig } = await queryContent('/components/gps-map').findOne()

const searchStore = useSearchStore()

const markers = computed(() => {
  return props.collection
    .flatMap((post) => {
      return post.addresses
        ?.filter((gpsAddress) => {
          if (!searchStore.selectedCityList?.length) {
            return true
          }
          return searchStore.selectedCityList?.includes(gpsAddress.address?.value?.properties?.city)
        })
        ?.map(geojsonAddressToMarkerOptions(post, geoportalConfig.center.projection))
    })
    .filter(Boolean)
})

if (process.client) {
  import('@ignf-geoportal/sdk-2d')
    .then(loadMap)
}

function loadMap(Gp: any) {
  const gpMap = Gp.Map.load('map', {
    ...geoportalConfig,
    layersOptions: {
      'GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2': {},
    },
    mapEventsOptions: {
      mapLoaded: onMapLoaded,
    },
  })

  function onMapLoaded() {
    emit('map-loaded')
    if (process.client) {
      document.querySelectorAll('#map .ol-zoom button')
        .forEach((btnEl) => {
          btnEl.classList.add('fr-btn')
        })
      setTimeout(() => {
        document.querySelectorAll('.ol-selectable img')
          .forEach((imgEl) => {
            imgEl.setAttribute('alt', 'Voir la fiche')
          })
      }, 1000)
    }
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
  height: 450px;
}
</style>

<style lang="scss">
.gp-feature-info-div {
  padding: 1rem 1.5rem !important;
  box-shadow: 0 6px 18px 0 rgb(0 0 18 / 16%) !important;
  border-radius: 0 !important;
  border: solid 1px var(--border-default-grey) !important;
}

.ol-selectable {
  cursor: pointer;
  filter: hue-rotate(180);

  &:hover img{
    opacity: .8;
  }

  &:active img{
    opacity: 1;
    filter: brightness(1.1) saturate(1.1) contrast(1.1);
  }
}

.ol-rotate {
  display: none !important;
}

.ol-zoom {
  right: 0;
  top: 50%;
  position: absolute;
  display: flex;
  flex-direction: column;
  transform: translateY(-50%);

  & button {
    margin: .25rem .5rem;
  }
}
</style>