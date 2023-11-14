<script setup lang="ts">

definePageMeta({
  middleware: [
    function() {
      const { selectedThematique } = useGpsSelectedThematiqueStore()
      if (!selectedThematique) {
        return navigateTo('/')
      }
    },
  ],
})

const postStore = useDispositifPostStore()

const getCardProps = (
  postItem: DispositifPost,
) => {
  return {
    title: postItem.name,
    description: getTextExtract(joinAddresses(postItem.addresses)),
    link: `/dispositifs/${postItem.id}`,
    titleTag: 'h2',
  }
}

</script>

<template>
  <GpsPostsIndex
    :post-store="postStore"
    do-use-search-store
    do-use-map
    :get-card-props="getCardProps"
    :card-type="'link'"
  />
</template>
