export function useGpsSearch () {
  const query = ref('')

  return {
    query,
    submit: () => submitSearch(query),
  }
}

function submitSearch (
  query: Ref<string>,
): void {
  // eslint-disable-next-line no-console
  console.log('Fetching with query:', query.value)
}
