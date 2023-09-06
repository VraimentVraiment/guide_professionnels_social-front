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
  post: GpsLocalizedPost,
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
  post: GpsLocalizedPost,
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

export async function geocodeCities(
  search: string,
  apiOptions: {
    apiUrl: string,
    basePostalCode?: string,
    queryParams: {
      lat?: number,
      lon?: number,
      limit?: number,
      type: string,
    }
  },
): Promise<GouvAddressFeature[] | null> {
  let query = `${apiOptions.apiUrl}/?q=${search}`

  const queryParams = Object.entries(apiOptions.queryParams)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')

  if (queryParams) {
    query += `&${queryParams}`
  }

  const result = await fetch(query)
  const data = (await result?.json()) as GouvAddressApiFeatureCollection

  const features = data
    ?.features
    ?.filter((feature) => {
      return (
        !apiOptions.basePostalCode ||
        feature.properties.citycode.substring(0, 2) === apiOptions.basePostalCode.toString()
      )
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
