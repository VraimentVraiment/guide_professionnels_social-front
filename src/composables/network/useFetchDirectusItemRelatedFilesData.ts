import {
  type DirectusFile,
} from 'nuxt-directus/dist/runtime/types'

/**
 *
 * Given a collection name and an item id in that collection, fetches related files data from the Directus API.
 * Depending on params 'getMeta', it will also fetch the meta data of the files (if not, it will only return the file ids).
 *
 * Several types of relations are supported:
 * - 'file': the field describes a single file id (default directus 'file' field)
 * - 'files': the field describes an array of relation_ids, which are ids of the relations in the relation collection (default directus 'files' field)
 * - 'many-to-many': the field describes an array of relation_ids, which are ids of the relations in the relation collection (custom M2M field)
 */
export async function useFetchDirectusItemRelatedFiles<T extends { id: number }>({
  collectionName,
  item,
  field,
  getMeta = false,
}: {
  collectionName: string
  item: T
  field: string
  getMeta?: false | string[]
}): Promise<{
  id: string
  file?: DirectusFile
  meta?: Record<string, any>
}[]> {
  const { getCollectionFilesModel } = useCollectionsModels()
  const model = getCollectionFilesModel(collectionName as string, field)

  if (
    !item ||
    !field ||
    !model
  ) {
    return []
  }

  const { ids, filesMeta } = (await getRelatedIds(item, field, model)) ?? { ids: [] }

  if (!ids?.length) {
    return []
  }

  if (!getMeta) {
    return ids
  }

  if ((
    model.type === 'files' && (
      !model.targetKey
    )
  ) || (
    model.type === 'many-to-many' && (
      !model.targetKey ||
        !model.relationCollectionName ||
        !model.targetCollectionName ||
        !model.fileIdField
    )
  )) {
    return []
  }

  const { getFiles } = useDirectusFiles()

  const files = await getFiles<DirectusFile>({
    params: {
      fields: ['id', ...getMeta],
      filter: {
        id: {
          _in: ids?.map(item => item.id),
        },
      },
    },
  })

  if (!files.length) {
    return []
  }

  return files
    ?.map((file) => {
      const id = file?.id as string
      const meta = model.type === 'many-to-many' && filesMeta?.find(item => item[model.fileIdField as string] === id)
      return {
        id,
        file,
        ...meta && { meta },
      }
    })
}

async function getRelatedIds<T extends { id: number }>(
  item: T,
  field: string,
  model: CollectionRelatedFilesModel,
): Promise<{
  ids: { id: string }[]
  filesMeta?: Record<string, any>[]
} | undefined> {
  switch (model.type) {
    case 'file': {
      const id = item[field as keyof T] as string
      if (!id) {
        break
      }
      return {
        ids: [{ id }],
      }
    }

    case 'files': {
      const relationsIds = item[field as keyof T] as string[]
      if (!relationsIds?.length) {
        break
      }
      const relations = await useFetchDirectusItems<{
        [model.targetKey]: number
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

      return {
        ids: relations
          ?.map((relation) => {
            return {
              id: relation[model.targetKey],
            }
          }),
      }
    }

    case 'many-to-many': {
      const relations = await useFetchDirectusItems<{
        [model.sourceKey]: number
        [model.targetKey]: number
      }>(
        {
          collectionName: model.relationCollectionName,
          params: {
            filter: {
              [model.sourceKey]: {
                _eq: item.id,
              },
            },
          },
        })

      if (!relations?.length) {
        break
      }

      const filesMeta = (
        await useFetchDirectusItems<{
          [model.fileIdField]: string
          [key in model.metaFields]: string
        }>({
          collectionName: model.targetCollectionName,
          params: {
            filter: {
              id: {
                _in: relations?.map(relation => relation[model.targetKey]),
              },
            },
            fields: [
              model.fileIdField,
              ...model.metaFields ?? [],
            ],
          },
        })
      ) ?? []

      if (!filesMeta.length) {
        break
      }

      return {
        ids: filesMeta
          ?.map((fileMeta) => {
            return {
              id: fileMeta[model.fileIdField],
            }
          }),
        filesMeta,
      }
    }
    default: {
      break
    }
  }
}
