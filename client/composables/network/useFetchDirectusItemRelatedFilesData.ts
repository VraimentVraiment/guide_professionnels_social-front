import {
  type DirectusFile,
} from 'nuxt-directus/dist/runtime/types'

type RelatedFileData = {
  id: string
  file?: DirectusFile
  meta?: Record<string, any>
}

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
}): Promise<RelatedFileData[]> {
  const { getCollectionFilesModel } = useCollectionsModelsStore()
  const model = getCollectionFilesModel(collectionName as string, field)

  if (!model) {
    return []
  }

  const { getFiles } = useDirectusFiles()

  switch (model.type) {
    case 'file': {
      const id = item[field as keyof T] as string

      if (!id) {
        return []
      }

      const ids = [{ id }]

      if (!getMeta) {
        return ids
      }

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

      return files
        .map((file) => {
          return {
            id,
            file,
          }
        })
    }
    case 'files': {
      if (
        !item ||
        !field ||
        !model ||
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

      if (!getMeta) {
        return ids
      }

      const files = (
        await getFiles<DirectusFile>({
          params: {
            fields: ['id', ...getMeta],
            filter: {
              id: {
                _in: ids?.map(item => item.id),
              },
            },
          },
        })
      )

      const filesData = files
        .map((file) => {
          return {
            id: file?.id as string,
            file,
          }
        })

      return filesData
    }
    case 'many-to-many': {
      if (
        !process.client ||
        !item.id ||
        !field ||
        !model ||
        !model.targetKey ||
        !model.relationCollectionName ||
        !model.targetCollectionName ||
        !model.fileIdField
      ) {
        return []
      }

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
        return []
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
      )

      if (!filesMeta.length) {
        return []
      }

      const ids = filesMeta
        ?.map((item) => {
          return {
            id: item[model.fileIdField],
          }
        })

      if (!getMeta) {
        return ids
      }

      const files = (
        await getFiles<DirectusFile>({
          params: {
            fields: ['id', ...getMeta],
            filter: {
              id: {
                _in: ids?.map(item => item.id),
              },
            },
          },
        })
      )

      if (!files.length) {
        return []
      }

      const filesData = ids
        ?.map(({ id }) => {
          const file = files.find(item => item?.id === id)
          const meta = filesMeta.find(item => item[model.fileIdField] === id)
          return {
            id,
            file,
            meta,
          }
        })

      return filesData
    }
    default: {
      return []
    }
  }
}
