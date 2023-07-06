import {
  type DirectusQueryParams,
} from 'nuxt-directus/dist/runtime/types'

export async function useFetchDirectusItems<T> ({
  collectionName,
  params,
}: {
  collectionName: string
  params?: DirectusQueryParams
}): Promise<T[]> {
  const { getItems } = useDirectusItems()

  try {
    const items = await getItems<T>({
      collection: collectionName,
      params,
    })

    return items
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
    return []
  }
}

export async function useFetchDirectusItem<T> ({
  collectionName,
  id,
}: {
  collectionName: string
  id: number
},
): Promise<T | null> {
  const { getItemById } = useDirectusItems()

  try {
    return await getItemById<T>({
      collection: collectionName,
      id: id.toString(),
    })
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
    return null
  }
}

export async function useFetchDirectusSinglePostItem<T extends Post> ({
  collectionName,
  id,
}: {
  collectionName: string
  id: number
}): Promise<{
  post: T | null
  files: {
    directus_files_id: string,
  }[]
}> {
  const {
    filesCollectionName,
    filesField,
  } = useCollectionsModelsStore()
    .getCollectionFilesModel(collectionName)

  const post = await useFetchDirectusItem<T>({ collectionName, id })

  const files = (
    !post ||
    !filesCollectionName ||
    !filesField ||
    post?.[filesField]?.length === 0 ||
    process.server
  )
    ? []
    : await useFetchDirectusItems<{
      directus_files_id: string,
    }>({
      collectionName: filesCollectionName as string,
      params: {
        filter: {
          id: {
            _in: post[filesField as keyof T],
          },
        },
      },
    })

  return {
    post,
    files,
  }
}
