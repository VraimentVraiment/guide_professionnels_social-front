/**
 * Fetches a single post item from Directus.
 * NB: "Posts" is not a native collection in Directus,
 * but a custom family of collections created for GPS ('gps_dispositifs', 'gps_fichestechniques').
 */
export async function useFetchItemFilesIds<ItemType> ({
  item,
  collectionName,
}: {
  item: ItemType
  collectionName: string
}): Promise<string[]> {
  const { getCollectionFilesModel } = useCollectionsModelsStore()
  const {
    filesCollectionName,
    filesField,
  } = getCollectionFilesModel(collectionName)

  if (
    process.client &&
    item &&
    filesCollectionName &&
    filesField
  ) {
    const filesId = item[filesField as keyof ItemType] as string[]

    if (filesId?.length) {
      const records = await useFetchDirectusItems<{
        directus_files_id: string,
      }>({
        collectionName: filesCollectionName as string,
        params: {
          filter: {
            id: {
              _in: filesId,
            },
          },
        },
      })

      return records
        .map((record) => {
          return record.directus_files_id
        })
    }
  }

  return []
}
