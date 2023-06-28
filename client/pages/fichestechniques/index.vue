<script setup lang="ts">

definePageMeta({
  layout: 'default',
})

const fichesTechniques = await useFetchDirectusItems<FicheTechniquePost>({
  collectionName: 'gps_fichestechniques',
})

const { getFiles } = useDirectusFiles()

const filesData = await Promise.all(
  fichesTechniques.map(async (ficheTechnique) => {
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

const getCardProps = (item: FicheTechniquePost) => {
  const fileData = filesData?.find(file => file.id === item.media)
  return {
    title: item.name,
    format: formatFormat(fileData?.type),
    size: formatBytes(fileData?.filesize),
    description: item?.description,
    href: `${getDirectusFile(item.media)}?download`,
    block: true,
  }
}

</script>

<template>
  <ClientOnly>
    <GpsPostCardGrid
      v-if="fichesTechniques?.length"
      :collection="fichesTechniques"
      :wrap-cards="true"
      :get-card-props="getCardProps"
      type="file"
    />
  </ClientOnly>
</template>

<style scoped lang="scss">
.fr-grid-row {
  margin: 0;
}
</style>
