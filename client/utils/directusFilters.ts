
const DEFAULT_DIRECTUS_FILTER: DirectusFilter = {
  id: {
    _gt: '800',
    _lt: '900',
  },
}

/**
 * Transforms a filters array containing FilterItemNodes to a DirectusFilter object,
 * which can be used to query the Directus API
 */
export function getDirectusFilter(
  filters?: FiltersCollection[],
): Promise<DirectusFilter> {

  if (!filters) { return DEFAULT_DIRECTUS_FILTER }

  const directusFilter: DirectusFilter = {}

  for (const collection of filters) {
    const checkedItems = collection.items
      ?.filter(item => item.checked)
      .map(item => item.id)

    if (checkedItems?.length) {

      directusFilter[collection.name] = {
        'caracteristique_dispositif_id': {
          "_in": checkedItems,
        },
      }
    }
  }

  return directusFilter
}

// {
// 	"_or": [
// 		{
// 			"_and": ['item1', 'item2']
// 		},
// 		{
// 			"_and": ['item2', 'item3']
// 		}
// 	]
