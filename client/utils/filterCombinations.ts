/* eslint-disable camelcase */
import {
  group,
  intersection,
} from 'd3-array'

export function getIdsMatchingRelatedCollection(
  filtersCollection: FiltersCollection,
  relationsCollection: RelationsCollection,
  relationModel: CollectionRelationModel,
  checkedItems: FilterItemNode[],
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
    [parent_id, siblingsItems]: [number | null, FilterItemNode[]],
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

export function getMatchingIds(
  targetIds: number[],
  relationsCollection: RelationsCollection,
  combination: 'and' | 'or' | 'unique',
  relationGroups: RelationGroups,
): number[] | null {
  switch (combination) {
    case 'unique': {
      return getIdsMatchingAtLeast(targetIds, relationsCollection)
    }
    case 'or': {
      return getIdsMatchingAtLeast(targetIds, relationsCollection)
    }

    case 'and': {
      return getIdsMatchingEvery(targetIds, relationsCollection, relationGroups)
    }
  }
}

/**
 * Given an array of targetIds and a collection of relations between targetIds and sourceIds,
 * return an array of sourceIds that are related to at least one of the targetIds.
 */
export function getIdsMatchingAtLeast(
  targetIds: number[],
  relationsCollection: RelationsCollection,
): number[] {
  const {
    sourceKey,
    targetKey,
  } = relationsCollection.relationModel as {
    targetKey: string
    sourceKey: string
  }
  return relationsCollection?.items
    ?.reduce((sourceIds, item) => {
      if (
        targetIds.includes(item[targetKey]) &&
        !sourceIds.includes(item[sourceKey])
      ) {
        sourceIds.push(item[sourceKey])
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
  relationsCollection: RelationsCollection,
  relationGroups: RelationGroups,
): number[] {
  const {
    targetKey,
    sourceKey,
  } = relationsCollection.relationModel as {
    targetKey: string
    sourceKey: string
  }

  const relationsGroup = relationGroups
    .find((relationGroup) => {
      return (
        relationGroup.sourceKey === sourceKey &&
        relationGroup.targetKey === targetKey
      )
    })
    ?.groups

  const ids = relationsGroup
    ?.filter((relatedIdsGroup) => {
      return targetIds.every((id) => {
        const relatedTargetIds = relatedIdsGroup[targetKey] as number[]
        return relatedTargetIds.includes(id)
      })
    })
    .map(relatedIdsGroup => relatedIdsGroup[sourceKey] as number)

  return ids ?? []
}
