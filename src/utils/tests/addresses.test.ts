import { expect } from 'vitest'

describe('joinAddresses', () => {
  it('returns an empty string for undefined input', () => {
    expect(joinAddresses(undefined)).toBe('')
  })

  it('joins the text of all addresses with a comma separator', () => {
    const gpsAddresses = [
      { address: { text: '123 Main St' } },
      { address: { text: '456 Elm St' } },
    ] as GpsAddress[]

    expect(joinAddresses(gpsAddresses)).toBe('123 Main St, 456 Elm St')
  })
})

describe('geojsonAddressToMarkerOptions', () => {
  it('returns null for an address with no coordinates', () => {
    const post = { id: '1', title: 'Test GpsPost' } as unknown as GpsLocalizedPost
    const projection = 'EPSG:3857'
    const gpsAddress = { address: { value: { geometry: {} } } } as GpsAddress

    expect(geojsonAddressToMarkerOptions(post, projection)(gpsAddress)).toBeNull()
  })

  it('returns a GpMarkerOptions object with the correct properties', () => {
    const post = {
      id: '1',
      name: 'Test GpsPost',
    } as unknown as GpsLocalizedPost
    const projection = 'EPSG:3857'
    const gpsAddress = {
      address: {
        text: '123 Main St',
        value: {
          geometry: {
            coordinates: [0, 0],
          },
        },
      },
    } as GpsAddress

    const result = geojsonAddressToMarkerOptions(post, projection)(gpsAddress)

    expect(result).toHaveProperty('position')
    expect(result?.position).toHaveProperty('x', 0)
    expect(result?.position).toHaveProperty('y', 0)
    expect(result?.position).toHaveProperty('projection', 'EPSG:3857')
  })
})

describe('geocodeCities', () => {
  const apiOptions = {
    apiUrl: 'https://api-adresse.data.gouv.fr/search',
    basePostalCode: '14',
    queryParams: {
      lat: 49.1756,
      lon: -0.3596,
      limit: 5,
      type: 'municipality',
    },
  }

  it('returns null for empty search string', async() => {
    const result = await geocodeCities('', apiOptions)
    expect(result).toBeNull()
  })

  it('returns null for invalid search string', async() => {
    const result = await geocodeCities('!@#$%^&*()', apiOptions)
    expect(result).toBeNull()
  })

  it('returns an array of GouvAddressFeature objects for valid search string', async() => {
    const result = await geocodeCities('Caen', apiOptions)
    expect(result).toBeInstanceOf(Array)
    expect(result?.[0]).toHaveProperty('type', 'Feature')
    expect(result?.[0]).toHaveProperty('properties')
    expect(result?.[0]).toHaveProperty('geometry')
  })

  it('filters results by postal code', async() => {
    const result1 = await geocodeCities('Caen', apiOptions)
    expect(result1).toBeInstanceOf(Array)
    expect(result1?.length).toBeGreaterThan(0)

    const result2 = await geocodeCities('Paris', apiOptions)
    expect(result2).toBeInstanceOf(Array)
    expect(result2).toHaveProperty('length', 0)
  })

  it('limits results to 5', async() => {
    const result = await geocodeCities('Caen', apiOptions)
    expect(result).toBeInstanceOf(Array)
    expect(result?.length).toBeLessThanOrEqual(5)
  })
})
