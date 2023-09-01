<script setup lang="ts">
import { computedAsync } from '@vueuse/core'

definePageMeta({
  layout: 'default',
  middleware: [
    'collections-models',
    'fichestechniques',
  ],
})

const postStore = useFicheTechniquePostStore()
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
  const files = await Promise.all(
    postStore.postsCollection
      ?.items
      ?.map(fetchRelatedFiles))

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
    href: `${useGetDirectusFileLink(item[FILE_FIELD], { download: true })}`,
    block: true,
  }
}

</script>

<template>
  <GpsGrid show-title>
    <template #bottom-left>
      <FilterSideBar
        id="fichestechniques-filtersidebar"
        :class="['fichestechniques-filtersidebar']"
        :post-store="postStore"
        make-unselectable
        :open-details="['gps_thematiques']"
        max-height="100vh"
      />
    </template>
    <template #bottom-right>
      <!-- <ClientOnly> -->
      <GpsPostCardGrid
        v-if="postStore.postsCollection?.items?.length"
        class="fichestechniques-postcard-grid"
        :collection="postStore.postsCollection?.items"
        :wrap-cards="true"
        :get-card-props="getCardProps"
        type="file"
      />
      <!-- </ClientOnly> -->
    </template>
  </GpsGrid>
</template>

<style scoped lang="scss">
.fichestechniques-filtersidebar {
  left: 0;
}
</style>
