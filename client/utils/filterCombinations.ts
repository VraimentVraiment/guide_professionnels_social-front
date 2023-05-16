import * as d3 from 'd3-array'

export function getIdsMatchingFilters ({
  collectionCheckedItemsIds,
  junction,
  combination,
}: {
  collectionCheckedItemsIds: number[],
  junction: Junction,
  combination: 'and' | 'or' | 'unique',
}): number[] | null {

  if (combination === 'or') {

    return getOrItems(junction, collectionCheckedItemsIds)

  } else if (combination === 'and') {

    return getAndItems(junction, collectionCheckedItemsIds)
  }

  return null
}


export function getOrItems(
  junction: Junction,
  collectionCheckedItemsIds: number[],
): number[] {
  return junction?.items
    ?.reduce((ids, item) => {
      if (
        collectionCheckedItemsIds.includes(item[junction.targetKey])
        && !ids.includes(item[junction.sourceKey])
      ) {
        ids.push(item[junction.sourceKey])
      }
      return ids
    }, [] as number[])
}

export function getAndItems(
  junction: Junction,
  collectionCheckedItemsIds: number[],
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
      return collectionCheckedItemsIds.every((id) => {
        const ids = d[junction.targetKey] as number[]
        return ids.includes(id)
      })
    })
    .map(d => d[junction.sourceKey] as number)
}
