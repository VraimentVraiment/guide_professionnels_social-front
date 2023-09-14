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
  }
}

</script>

<template>
  <GpsPostsIndex
    id="dispositifs"
    :post-store="postStore"
    do-use-search-store
    do-use-map
    :get-card-props="getCardProps"
    :open-details="['gps_caracteristiquesdispositif']"
    :card-type="'link'"
  />
</template>
