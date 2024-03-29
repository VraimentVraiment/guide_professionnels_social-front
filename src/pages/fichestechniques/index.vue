<script setup lang="ts">

import { computedAsync } from '@vueuse/core'

const postStore = useFicheTechniquePostStore()
if (!postStore.postsCollectionName) {
  postStore.setPostCollection('gps_fichestechniques')
}

const FILE_FIELD = 'media'
const fetchRelatedFiles = (item: FicheTechniquePost) => {
  return useFetchDirectusItemRelatedFiles<FicheTechniquePost>({
    collectionName: 'gps_fichestechniques',
    item,
    field: FILE_FIELD,
    getMeta: ['type', 'filesize'],
  })
}

const filesData = computedAsync(async() => {
  const files = (
    await Promise.allSettled(
      postStore.postsCollection
        ?.items
        ?.map(fetchRelatedFiles),
    )
  )
    .map((result) => {
      if (result.status === 'fulfilled') {
        return result.value
      }
      return null
    })
    .filter(Boolean)

  return files.flat()
}, [])

const getCardProps = (
  item: FicheTechniquePost,
) => {
  const fileData = filesData.value
    ?.find((file) => {
      return file?.id.toString() === item[FILE_FIELD]
    })

  return {
    title: item.name,
    format: formatFileFormat(fileData?.file?.type ?? null),
    size: formatBytes(fileData?.file?.filesize ?? null),
    href: useGetDirectusFileLink(item[FILE_FIELD], { download: true }) ?? '',
    // block: true,
  }
}

</script>

<template>
  <GpsPostsIndex
    :post-store="postStore"
    :get-card-props="getCardProps"
    :card-type="'file'"
  />
</template>
