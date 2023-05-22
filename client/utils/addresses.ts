export function formatAddresses(addresses) {
  return addresses
    ?.map(({ address }) => {
      return address.text
    })
    ?.join(', ')
}