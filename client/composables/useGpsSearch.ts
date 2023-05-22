export function useGpsSearch () {
  const query = ref('')

  return {
    query,
    submit: () => submitSearch(query),
  }
}

async function submitSearch (
  query: Ref<string>,
): Promise<DirectusItem[]> {
  // eslint-disable-next-line no-console
  console.log('Fetching with query:', query.value)

  const items = await useFetchDirectusItems({
    collectionName: 'fiches_dispositif',
    params: {
      search: query.value,
    },
  })

  // eslint-disable-next-line no-console
  console.log('Fetched items:', items)

  return items
}
