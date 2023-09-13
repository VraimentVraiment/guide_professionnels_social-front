<script setup lang="ts">

definePageMeta({
  layout: 'default',
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
    description: joinAddresses(postItem.addresses),
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
    :open-details="['gps_caracteristiquesdispositif']"
    :get-card-props="getCardProps"
    :card-type="'link'"
  />
</template>
