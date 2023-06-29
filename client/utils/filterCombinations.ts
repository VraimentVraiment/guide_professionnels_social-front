/* eslint-disable camelcase */
import {
  group,
  intersection,
} from 'd3-array'

export function getIdsMatchingRelatedCollection (
  filtersCollection: FiltersCollection,
  relationsCollection: RelationsCollection,
  relationModel: CollectionRelationModel,
  checkedItems: FilterItemNode[],
) {
  switch (relationModel.userSelection) {
    case 'single-node':
      return getMatchingIds(
        checkedItems.map(i => i.id),
        relationsCollection,
        'and',
      )

    case 'leaves-only': {
      const siblingsGroups = group(checkedItems, d => d.parent_id)

      const getParentCombination = (
        parent_id: number | null,
      ): 'and' | 'or' | 'unique' => {
        return filtersCollection.items
          .find((item) => {
            return item.id === parent_id
          })
          ?.combination ?? 'and'
      }

      const getSiblingGroupMatchingIds = (
        [parent_id, items]: [number | null, FilterItemNode[]],
      ): number[] => {
        return getMatchingIds(
          items.map(i => i.id),
          relationsCollection,
          getParentCombination(parent_id),
        ) as number[]
      }

      const siblingGroupsMatchingIds = Array.from(siblingsGroups, getSiblingGroupMatchingIds)

      return Array.from(intersection(...siblingGroupsMatchingIds))
    }
  }
}

export function getMatchingIds (
  itemsIds: number[],
  relationsCollection: RelationsCollection,
  combination: 'and' | 'or' | 'unique',
): number[] | null {
  switch (combination) {
    case 'unique': {
      return itemsIds
    }

    case 'or': {
      return getOrItems(relationsCollection, itemsIds)
    }

    case 'and': {
      return getAndItems(relationsCollection, itemsIds)
    }
  }
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

  const groups = group(
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
