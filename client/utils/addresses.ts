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
}

export function formatAddresses(addresses) {
  return addresses
    ?.map(({
      address,
    }) => {
      return address.text
    })
    ?.join(', ')
}

export const geojsonAddressToMarkerOptions = (post, projection) => ({
  address,
}): GpMarkerOptions[] | null => {
  const coordinates = address?.value?.geometry?.coordinates
  if (!coordinates) { return null }
  return {
    position: {
      x: coordinates?.[0],
      y: coordinates?.[1],
      projection,
    },
    content: getMarkerTooltipContent(post, address),
    // url: "/images/marker.png",
  };
}

function getMarkerTooltipContent(post, address) {
  return `
  <div class="gps-marker-tooltip">
    <h6>${post.name}</h6>
    <p>${address.text}</p>
    <p>
      <a
        class="gps-link fr-link fr-fi-arrow-right-line fr-link--icon-right"
        href="/dispositifs/${post.id}"
      >Voir le dispositif</a>
    </p>
  </div>
  `
}
