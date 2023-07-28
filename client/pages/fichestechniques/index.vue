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

const { getFiles } = useDirectusFiles()

/**
 * @todo create a useGetPostFiles composable that uses collection models
 * same as in dispositifs/[id].vue
 */
const filesData = computedAsync(async() => {
  return await Promise.all(
    postStore.postsCollection
      ?.items
      ?.map(async(ficheTechnique) => {
        const files = await getFiles<DirectusFileData>({
          params: {
            fields: ['id', 'filesize', 'type'],
            filter: {
              id: {
                _in: ficheTechnique.media,
              },
            },
          },
        })
        return files?.[0]
      }),
  )
}, [])

const getCardProps = (item: FicheTechniquePost) => {
  const fileData = filesData.value?.find(file => file.id.toString() === item.media)
  return {
    title: item.name,
    format: formatFileFormat(fileData?.type ?? null),
    size: formatBytes(fileData?.filesize ?? null),
    href: `${useGetDirectusFileLink(item.media, { download: true })}`,
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
