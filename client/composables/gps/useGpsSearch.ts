export function useGpsSearch () {
  const query = ref('')

  return {
    query,
    // submit: () => submitSearch(query),
  }
}
