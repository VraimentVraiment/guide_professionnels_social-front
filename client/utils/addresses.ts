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
  const ovArrowIcon = '<svg class="ov-icon" aria-hidden="true" width="19.2" height="19.2" viewBox="0 0 24 24" fill="currentColor" style="font-size: 1.2em;"><path fill="none" d="M0 0h24v24H0z"></path><path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"></path></svg>'
  return `
  <div class="gps-marker-tooltip">
    <h6>${post.name}</h6>
    <p>${address.text}</p>
    <p>
      <a
        class="gps-link fr-link"
        href="/dispositifs/${post.id}"

      >
        Voir le dispositif ${ovArrowIcon}
      </a>
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
