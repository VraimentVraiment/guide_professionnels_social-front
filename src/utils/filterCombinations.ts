/* eslint-disable camelcase */
import {
  group,
  intersection,
} from 'd3-array'

/**
 * This code is used to determine which items in a collection are related to
 * a set of checkable items in a filters collection (which has a hierarchical structure), following a many-to-many relation.
 *
 * For example, given a collection of posts and a collection of filters, we want to know
 * which posts are related to the checked filters.
 *
 * Several behaviors are supported:
 * - "single-node": Only one filter can be checked at a time. Only the posts that are related to the checked filter are returned.
 * - "leaves-only": Only the filters that have no children can be checked. Three rules of combination are supported within a group of leaves:
 *    - 'And' combination: Only the posts that are related to all of the checked filters are returned.
 *    - 'Or' combination: Only the posts that are related to at least one of the checked filters are returned.
 *    - 'Unique' combination: Only one leaf filter can be checked at a time. Only the posts that are related to the checked filter are returned.
 *    Groups or leaves are then combined using the 'And' combination.
 *
 * We have to fetch relationsCollection and compute matches in our app,
 * because directus does not support for now queries that use the same field several times.
 * For example, this type of query does not work:
 * filter: [
 *  "and": [
 *    "id": {
 *      "_in": [1, 2, 3]
 *    },
 *    "id": {
 *      "_in": [3, 4, 5]
 *    }
 * ]
 *
 * But it may be possible to do it in the future
 */

export function getIdsMatchingRelatedCollection(
  filtersCollection: FiltersCollection,
  relationsCollection: RelationsCollection,
  relationModel: CollectionRelationModel,
  checkedItems: GpsFilterItemNode[],
  relationGroups: RelationGroups,
) {
  switch (relationModel.userSelection) {
    case 'single-node':
      return getMatchingIds(
        checkedItems.map(i => i.id),
        relationsCollection,
        'and',
        relationGroups,
      )

    case 'leaves-only': {
      const siblingsGroups = group(checkedItems, d => d.parent_id)
      const siblingGroupsMatchingIds = Array.from(siblingsGroups, getSiblingGroupMatchingIds)
      return Array.from(intersection(...siblingGroupsMatchingIds))
    }
  }

  function getSiblingGroupMatchingIds(
    [parent_id, siblingsItems]: [number | null, GpsFilterItemNode[]],
  ): number[] {
    const parentItem = filtersCollection.items
      .find((item) => {
        return item.id === parent_id
      })

    const combination = parentItem?.combination ?? 'and'
    return getMatchingIds(
      siblingsItems.map(i => i.id),
      relationsCollection,
      combination,
      relationGroups,
    ) as number[]
  }
}

/**
 * Given an array of targetIds and a collection of relations between targetIds and sourceIds,
 * return an array of sourceIds that are related to the targetIds,
 * following the given combination rule ('and', 'or', 'unique')
 */
function getMatchingIds(
  targetIds: number[],
  relationsCollection: RelationsCollection,
  combination: 'and' | 'or' | 'unique',
  relationGroups: RelationGroups,
): number[] | null {
  const {
    sourceKey,
    targetKey,
  } = relationsCollection.relationModel as {
    targetKey: string
    sourceKey: string
  }
  switch (combination) {
    case 'unique': {
      return getIdsMatchingAtLeast(targetIds, relationsCollection.items, sourceKey, targetKey)
    }
    case 'or': {
      return getIdsMatchingAtLeast(targetIds, relationsCollection.items, sourceKey, targetKey)
    }

    case 'and': {
      return getIdsMatchingEvery(targetIds, relationGroups, sourceKey, targetKey)
    }
  }
}

/**
 * Given an array of targetIds and a collection of relations between targetIds and sourceIds,
 * return an array of sourceIds that are related to at least one of the targetIds.
 */
export function getIdsMatchingAtLeast(
  targetIds: number[],
  relationItems: DirectusRelationItem[],
  sourceKey: string,
  targetKey: string,
): number[] {
  return relationItems
    ?.reduce((sourceIds, relationItem) => {
      if (
        !targetIds?.length || (
          targetIds.includes(relationItem[targetKey]) &&
          !sourceIds.includes(relationItem[sourceKey])
        )
      ) {
        sourceIds.push(relationItem[sourceKey])
      }
      return sourceIds
    }, [] as number[])
}

/**
 * Given an array of targetIds and a collection of relations between targetIds and sourceIds,
 * return an array of sourceIds that are related to all of the targetIds.
 */
export function getIdsMatchingEvery(
  targetIds: number[],
  relationGroups: RelationGroups,
  sourceKey: string,
  targetKey: string,
): number[] {
  const groups = relationGroups
    .find((relationGroup) => {
      return (
        relationGroup.sourceKey === sourceKey &&
        relationGroup.targetKey === targetKey
      )
    })
    ?.groups

  const ids = groups
    ?.filter((relatedIdsGroup) => {
      return targetIds.every((id) => {
        const relatedTargetIds = relatedIdsGroup[targetKey] as number[]
        return relatedTargetIds?.includes(id)
      })
    })
    .map(relatedIdsGroup => relatedIdsGroup[sourceKey] as number)

  return ids ?? []
}
