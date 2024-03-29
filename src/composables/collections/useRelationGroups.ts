import {
  group,
} from 'd3-array'

export function useRelationGroups(
  relationsCollections: Ref<RelationsCollection[]>,
) {
  const relationGroups = computed(() => {
    return relationsCollections.value
      .filter((relationsCollection) => {
        return relationsCollection.relationModel.relationType === 'many-to-many'
      })
      .map((relationsCollection) => {
        const {
          targetKey,
          sourceKey,
        } = relationsCollection.relationModel as {
          targetKey: string
          sourceKey: string
        }

        // Group relations if they are related to the same source item
        const relationsGroups = group(
          relationsCollection.items,
          item => item[sourceKey],
        )

        return {
          targetKey,
          sourceKey,
          groups: Array
            .from(relationsGroups, ([sourceId, relationGroup]) => {
              return {
                [sourceKey]: sourceId,
                [targetKey]: relationGroup.map(relationItem => relationItem[targetKey]),
              }
            }),
        }
      })
  })

  return relationGroups
}
