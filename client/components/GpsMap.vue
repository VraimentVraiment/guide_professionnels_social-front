<script lang="ts" setup>

const props = defineProps<{
  collection: Post[]
}>()

const emit = defineEmits(["map-loaded"]);

/**
 * @see https://ignf.github.io/geoportal-sdk/latest/jsdoc/Gp.MarkerOptions.html
 */
type GpMarkerOptions = {
  position?: {
    x: number;
    y: number;
    projection?: string;
  };
  content: string;
  contentType?: string;
  url?: string; // Icon URL used to materialize the marker.
  offset?: [number, number];
  ppoffset?: [number, number];
  autoPanOptions: GpAutoPanOptions;
};
let map: any;

const markers = computed(() => {
  return props.collection.flatMap((post) => {
    return (post.addresses || [])
      .map(({ address }): GpMarkerOptions[] => {
        const coordinates = address?.value?.geometry?.coordinates
        return {
          position: {
            x: coordinates?.[0],
            y: coordinates?.[1],
            projection: "CRS:84",
          },
          content: getMarkerTooltipContent(post, address),
          // url: "/images/marker.png",
        };
      })
  })
})

if (process.client) {
  import("@ignf-geoportal/sdk-2d")
    .then((Gp) => {
      renderMap(Gp);
    });
}

function getMarkerTooltipContent(post, address) {
  return `
  <div class="gps-marker-tooltip">
    <h6>${post.name}</h6>
    <p>${address.text}</p>
    <p><a class="gps-link fr-link fr-fi-arrow-right-line fr-link--icon-right" href="/dispositifs/${post.id}">Voir le dispositif</a></p>
  </div>
  `
}

function renderMap(Gp: any) {
  map = Gp.Map.load("map", {
    apiKey: "cartes,essentiels",
    center: {
      x: -0.3596,
      y: 49.1756,
      projection: "CRS:84",
    },
    zoom: 9,
    layersOptions: {
      "GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2": {},
    },
    controlsOptions: {
      "search": {
        maximised: true,
      },
    },
    mapEventsOptions: {
      "mapLoaded": onMapLoaded,
    },
  });
}

function onMapLoaded() {
  emit("map-loaded");
  map.setMarkersOptions(markers.value);
  console.log(map)
  watch(markers, () => {
    map.setMarkersOptions(markers.value);
  });
}

</script>

<template>
  <div id="map" />
</template>

<style scoped>
#map {
  width: 100%;
  height: 600px;
}
</style>
<style lang="scss">
.gp-feature-info-div {
  padding: 1rem 1.5rem !important;
  box-shadow: 0 6px 18px 0 rgba(0, 0, 18, 16%) !important;
  border-radius: 0 !important;
  border: solid 1px var(--border-default-grey) !important;
}
</style>
