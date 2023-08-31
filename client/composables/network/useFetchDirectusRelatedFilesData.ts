import {
  type DirectusFile,
} from 'nuxt-directus/dist/runtime/types'

type RelatedFileData = {
  id: string
  file?: DirectusFile
  meta?: {
    title: string
    description: string
  }
}

export async function useFetchDirectusRelatedFilesData<T extends { id: number }>({
  collectionName,
  item,
  field,
}: {
  collectionName: string
  item: T
  field: string
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

      const files = await getFiles<DirectusFile>({
        params: {
          fields: ['id', 'filesize', 'type'],
          filter: {
            id: {
              _eq: id,
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
        }) ?? []
    }
    case 'many-to-many': {
      if (
        !process.client ||
        !item.id ||
        !model ||
        !model ||
        !field ||
        !model.targetKey ||
        !model.relationCollectionName ||
        !model.targetCollectionName
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

      const importantFilesMeta = (
        await useFetchDirectusItems<{
          title: string
          description: string
          file: string
        }>({
          collectionName: model.targetCollectionName,
          params: {
            filter: {
              id: {
                _in: relations?.map(relation => relation[model.targetKey]),
              },
            },
            fields: [
              'title',
              'description',
              'file',
            ],
          },
        })
      )

      if (!importantFilesMeta.length) {
        return []
      }

      const files = (
        await getFiles<DirectusFile>({
          params: {
            fields: ['id', 'type', 'filesize'],
            filter: {
              id: {
                _in: importantFilesMeta?.map(item => item.file),
              },
            },
          },
        })
      )

      if (!files.length) {
        return []
      }

      const importantFiles = files
        ?.map((file) => {
          const meta = importantFilesMeta.find(item => item.file === file?.id)
          return {
            id: file?.id,
            file,
            meta: {
              title: meta?.title ?? '',
              description: meta?.description ?? '',
            },
          }
        })

      return importantFiles
    }
    default: {
      return []
    }
  }
}
