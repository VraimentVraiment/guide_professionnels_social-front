import * as d3 from 'd3-array'

export function getMatchingIds({
  collection,
  checkedItems,
  junction,
}: {
  collection: FiltersCollection,
  checkedItems: FilterItemNode[],
  junction: Junction,
}) {

  const idGetter = {

    'single-node': () => getIdsMatchingFilters({
      itemsIds: checkedItems.map(i => i.id),
      combination: 'and',
      junction,
    }),

    'leaves-only': () => Array.from(
      d3.intersection(...
        Array.from(
          d3.group(checkedItems, d => d.parent_id),
          ([parent_id, items]) =>
            getIdsMatchingFilters({
              itemsIds: items.map(i => i.id),
              combination: collection.items.find(i => i.id === parent_id)?.combination ?? 'and',
              junction,
            }) as number[],
        ),
      ),
    ),
  }

  return idGetter[collection.userSelection as keyof typeof idGetter]()
}

export function getIdsMatchingFilters({
  itemsIds,
  junction,
  combination,
}: {
  itemsIds: number[],
  junction: Junction,
  combination: 'and' | 'or' | 'unique',
}): number[] | null {

  if (combination === 'or') {

    return getOrItems(junction, itemsIds)

  } else if (combination === 'and') {

    return getAndItems(junction, itemsIds)
  }

  return null
}


export function getOrItems(
  junction: Junction,
  itemsIds: number[],
): number[] {
  return junction?.items
    ?.reduce((ids, item) => {
      if (
        itemsIds.includes(item[junction.targetKey])
        && !ids.includes(item[junction.sourceKey])
      ) {
        ids.push(item[junction.sourceKey])
      }
      return ids
    }, [] as number[])
}

export function getAndItems(
  junction: Junction,
  itemsIds: number[],
): number[] {

  const groups = d3.group(
    junction.items,
    d => d[junction.sourceKey],
  )

  return Array
    .from(groups, ([key, value]) => ({
      [junction.sourceKey]: key,
      [junction.targetKey]: value.map(d => d[junction.targetKey]),
    }),
    )
    .filter((d) => {
      return itemsIds.every((id) => {
        const ids = d[junction.targetKey] as number[]
        return ids.includes(id)
      })
    })
    .map(d => d[junction.sourceKey] as number)
}
