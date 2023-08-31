export async function useFetchDirectusItemRelatedFilesIds<T>({
  item,
  field,
  collectionName,
}: {
  item: T
  field: string
  collectionName: string
}): Promise<{ id: string }[]> {
  const { getCollectionFilesModel } = useCollectionsModelsStore()
  const model = getCollectionFilesModel(collectionName, field)

  if (!model) {
    return []
  }

  switch (model.type) {
    case 'file': {
      const id = item[field as keyof T] as string
      return [{ id }]
    }
    case 'files': {
      if (
        // !process.client ||
        !item ||
        !model ||
        !model ||
        !field ||
        !model.targetKey
      ) {
        return []
      }

      const relationsIds = item[field as keyof T] as string[]

      if (!relationsIds?.length) {
        return []
      }
      const relations = await useFetchDirectusItems<{
        [model.targetKey]: string,
      }>({
        collectionName: model.relationCollectionName,
        params: {
          filter: {
            id: {
              _in: relationsIds,
            },
          },
        },
      })

      const ids = relations
        ?.map((relation) => {
          return {
            id: relation[model.targetKey],
          }
        })

      return ids
    }
    default: {
      return []
    }
  }
}
