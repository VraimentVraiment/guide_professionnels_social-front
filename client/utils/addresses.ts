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

export function joinAddresses (
  addresses,
): string {
  return addresses
    ?.map(({
      address,
    }) => {
      return address.text
    })
    ?.join(', ') ?? ''
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
    // url: "/marker.svg",
  }
}

function getMarkerTooltipContent (post, address) {
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

export async function getCities (search: string) {
  const API_URL = 'https://api-adresse.data.gouv.fr/search'
  const BASE_POSTAL_CODE = '14'
  const lat = 49.1756
  const lon = -0.3596
  const limit = 5

  const query = `${API_URL}/?q=${search}&type=municipality&limit=${limit}&lat=${lat}&lon=${lon}&autocomplete=1`
  const data = await (
    await fetch(query)
  )?.json()

  return data
    ?.features
    ?.filter((feature: any) => {
      return feature.properties.citycode.substring(0, 2) === BASE_POSTAL_CODE
    })
}

export function addressMatch (
  addresses: Address[], cityList: string[],
): boolean {
  return addresses.some((address) => {
    return cityList.includes(address.address?.value?.properties?.city)
  })
}
