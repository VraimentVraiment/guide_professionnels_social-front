import * as d3 from 'd3-array'

export function getMatchingIds ({
  relationModel,
  filtersCollection,
  checkedItems,
  junction,
}: {
  relationModel: CollectionRelationModel,
  filtersCollection: FiltersCollection,
  checkedItems: FilterItemNode[],
  junction: RelationsCollection,
}) {
  const idGetter = {

    'single-node': () => getIdsMatchingFilters({
      itemsIds: checkedItems.map(i => i.id),
      combination: 'and',
      junction,
    }),

    'leaves-only': () => Array.from(
      d3.intersection(...Array.from(
        d3.group(checkedItems, d => d.parent_id),
        ([parent_id, items]) =>
            getIdsMatchingFilters({
              itemsIds: items.map(i => i.id),
              combination: filtersCollection.items
                .find((item) => {
                  return item.id === parent_id
                })
                ?.combination ?? 'and',
              junction,
            }) as number[],
      ),
      ),
    ),
  }

  return idGetter[relationModel.userSelection as keyof typeof idGetter]()
}

export function getIdsMatchingFilters ({
  itemsIds,
  junction,
  combination,
}: {
  itemsIds: number[],
  junction: RelationsCollection,
  combination: 'and' | 'or' | 'unique',
}): number[] | null {
  if (combination === 'or') {
    return getOrItems(junction, itemsIds)
  } else if (combination === 'and') {
    return getAndItems(junction, itemsIds)
  }

  return null
}

export function getOrItems (
  junction: RelationsCollection,
  itemsIds: number[],
): number[] {
  return junction?.items
    ?.reduce((ids, item) => {
      if (
        itemsIds.includes(item[junction.junctionTargetKey]) &&
        !ids.includes(item[junction.junctionSourceKey])
      ) {
        ids.push(item[junction.junctionSourceKey])
      }
      return ids
    }, [] as number[])
}

export function getAndItems (
  junction: RelationsCollection,
  itemsIds: number[],
): number[] {
  const groups = d3.group(
    junction.items,
    d => d[junction.junctionSourceKey],
  )

  return Array
    .from(groups, ([key, value]) => ({
      [junction.junctionSourceKey]: key,
      [junction.junctionTargetKey]: value.map(d => d[junction.junctionTargetKey]),
    }),
    )
    .filter((d) => {
      return itemsIds.every((id) => {
        const ids = d[junction.junctionTargetKey] as number[]
        return ids.includes(id)
      })
    })
    .map(d => d[junction.junctionSourceKey] as number)
}
