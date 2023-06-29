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

const filesData = computedAsync(async () => {
  return await Promise.all(
    postStore.postsCollection
      ?.items
      ?.map(async (ficheTechnique) => {
        return (await getFiles({
          params: {
            fields: ['id', 'filesize', 'type'],
            filter: {
              id: {
                _in: ficheTechnique.media,
              },
            },
          },
        }))?.[0]
      }),
  )
}, [])

const getCardProps = (item: FicheTechniquePost) => {
  const fileData = filesData.value?.find(file => file.id === item.media)
  return {
    title: item.name,
    format: formatFormat(fileData?.type),
    size: formatBytes(fileData?.filesize),
    href: `${getDirectusFile(item.media)}?download`,
    block: true,
  }
}

</script>

<template>
  <GpsGrid
    show-title
  >
    <template #bottom-left>
      <FilterSideBar
        :post-store="postStore"
        make-unselectable
        :open-details="['gps_thematiques']"
      />
    </template>
    <template #bottom-right>
      <ClientOnly>
        <GpsPostCardGrid
          v-if="postStore.postsCollection?.items?.length"
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
.fr-grid-row {
  margin: 0;
}
</style>
