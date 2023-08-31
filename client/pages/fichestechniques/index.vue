<script setup lang="ts">
import { computedAsync } from '@vueuse/core'

import {
  type DirectusFile,
} from 'nuxt-directus/dist/runtime/types'

definePageMeta({
  layout: 'default',
  middleware: [
    'collections-models',
    'fichestechniques',
  ],
})

const postStore = useFicheTechniquePostStore()
const fileFieldKey = 'media'

const filesData = computedAsync(async() => {
  return await Promise.all(
    postStore.postsCollection
      ?.items
      ?.map(item => useFetchDirectusItemRelatedFiles<FicheTechniquePost>({
        collectionName: 'gps_fichestechniques',
        item,
        field: fileFieldKey,
        getMeta: ['type', 'filesize'],
      })),
  ).then(files => files.flat())
}, [])

const getCardProps = (
  item: FicheTechniquePost,
) => {
  const fileData = filesData.value
    ?.find(file => file?.id.toString() === item[fileFieldKey]) as DirectusFile

  return {
    title: item.name,
    format: formatFileFormat(fileData?.file.type ?? null),
    size: formatBytes(fileData?.file.filesize ?? null),
    href: `${useGetDirectusFileLink(item[fileFieldKey], { download: true })}`,
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
      <ClientOnly>
        <GpsPostCardGrid
          v-if="postStore.postsCollection?.items?.length"
          class="fichestechniques-postcard-grid"
          :collection="postStore.postsCollection?.items"
          :wrap-cards="true"
          :get-card-props="getCardProps"
          type="file"
        />
      </ClientOnly>
    </template>
  </GpsGrid>
</template>

<style scoped lang="scss">
@import "@/styles/";

.fichestechniques-filtersidebar {
  left: 0;
}

.fichestechniques-postcard-grid {
  margin-top: 3rem;

  @include md {
    margin-top: 0;
  }
}

.fr-grid-row {
  margin: 0;
}
</style>
