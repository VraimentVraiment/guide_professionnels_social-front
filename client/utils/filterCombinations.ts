import * as d3 from 'd3-array'

export function getMatchingIds ({
  relationModel,
  filtersCollection,
  checkedItems,
  relationsCollection,
}: {
  relationModel: CollectionRelationModel,
  filtersCollection: FiltersCollection,
  checkedItems: FilterItemNode[],
  relationsCollection: RelationsCollection,
}) {
  const idGetter = {

    'single-node': () => getIdsMatchingFilters({
      itemsIds: checkedItems.map(i => i.id),
      combination: 'and',
      relationsCollection,
    }),

    'leaves-only': () => Array.from(
      d3.intersection(...Array.from(
        d3.group(checkedItems, d => d.parent_id),
        // eslint-disable-next-line camelcase
        ([parent_id, items]) =>
            getIdsMatchingFilters({
              itemsIds: items.map(i => i.id),
              combination: filtersCollection.items
                .find((item) => {
                  // eslint-disable-next-line camelcase
                  return item.id === parent_id
                })
                ?.combination ?? 'and',
              relationsCollection,
            }) as number[],
      ),
      ),
    ),
  }

  return idGetter[relationModel.userSelection as keyof typeof idGetter]()
}

export function getIdsMatchingFilters ({
  itemsIds,
  relationsCollection,
  combination,
}: {
  itemsIds: number[],
  relationsCollection: RelationsCollection,
  combination: 'and' | 'or' | 'unique',
}): number[] | null {
  if (combination === 'or') {
    return getOrItems(relationsCollection, itemsIds)
  } else if (combination === 'and') {
    return getAndItems(relationsCollection, itemsIds)
  }

  return null
}

export function getOrItems (
  relationsCollection: RelationsCollection,
  itemsIds: number[],
): number[] {
  const {
    targetKey,
    sourceKey,
  } = relationsCollection.relationModel as {
    targetKey: string
    sourceKey: string
  }
  return relationsCollection?.items
    ?.reduce((ids, item) => {
      if (
        itemsIds.includes(item[targetKey]) &&
        !ids.includes(item[sourceKey])
      ) {
        ids.push(item[sourceKey])
      }
      return ids
    }, [] as number[])
}

export function getAndItems (
  relationsCollection: RelationsCollection,
  itemsIds: number[],
): number[] {
  const {
    targetKey,
    sourceKey,
  } = relationsCollection.relationModel as {
    targetKey: string
    sourceKey: string
  }

  const groups = d3.group(
    relationsCollection.items,
    d => d[sourceKey],
  )

  return Array
    .from(groups, ([key, value]) => ({
      [sourceKey]: key,
      [targetKey]: value.map(d => d[targetKey]),
    }),
    )
    .filter((d) => {
      return itemsIds.every((id) => {
        const ids = d[targetKey] as number[]
        return ids.includes(id)
      })
    })
    .map(d => d[sourceKey] as number)
}
