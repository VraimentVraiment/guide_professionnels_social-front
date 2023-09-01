export function joinAddresses(
  gpsAddresses: GpsAddress[] | undefined,
): string {
  const join = gpsAddresses
    ?.map((gpsAddress) => {
      return gpsAddress.address.text
    })
    ?.join(', ')

  return join ?? ''
}

export const geojsonAddressToMarkerOptions = (
  post: LocalizedPost,
  projection: string,
) => (
  gpsAddress: GpsAddress,
): GpMarkerOptions | null => {
  const coordinates = gpsAddress.address?.value?.geometry?.coordinates
  if (!coordinates) {
    return null
  }

  return {
    position: {
      x: coordinates?.[0],
      y: coordinates?.[1],
      projection,
    },
    content: getMarkerTooltipContent(post, gpsAddress.address),
    // url: "/marker.svg", // Icon URL that can be used to replace default marker.
  }
}

function getMarkerTooltipContent(
  post: LocalizedPost,
  address: GpsAddress['address'],
) {
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

export async function getCities(
  search: string,
): Promise<GouvAddressFeature[] | null> {
  const API_URL = 'https://api-adresse.data.gouv.fr/search'
  const BASE_POSTAL_CODE = '14'
  const lat = 49.1756
  const lon = -0.3596
  const limit = 5

  const query = `${API_URL}/?q=${search}&type=municipality&limit=${limit}&lat=${lat}&lon=${lon}&autocomplete=1`
  const result = await fetch(query)
  const data = (await result?.json()) as GouvAddressApiFeatureCollection

  const features = data
    ?.features
    ?.filter((feature) => {
      return feature.properties.citycode.substring(0, 2) === BASE_POSTAL_CODE
    })

  return features ?? null
}

export function addressMatch(
  gpsAddresses: GpsAddress[] | undefined,
  cityList: string[],
): boolean {
  const match = gpsAddresses
    ?.some((gpsAddress) => {
      return cityList.includes(gpsAddress.address?.value?.properties?.city)
    })

  return match ?? false
}
