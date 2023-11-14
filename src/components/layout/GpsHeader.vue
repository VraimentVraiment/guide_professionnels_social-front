<script setup lang="ts">

const content = await queryContent('/components/header').findOne()

const isAuthenticated = useIsAuthenticated()

const directusProps = await useFetchDirectusItems({
  collectionName: 'gps_site_header',
}) as unknown as {
  service_title: string
  service_description: string
  logo_text: string
}

const quickLinks = computed(() => {
  return content.quickLinks
    ?.filter((quickLink: GpsQuickLink) => {
      return isAuthenticated.value || quickLink.public
    }) ?? []
})

const { someModalOpen } = useSomeModalOpen()

const logoText = directusProps?.logo_text?.split('\n') ?? ''
const serviceTitle = directusProps?.service_title ?? ''
const serviceDescription = directusProps?.service_description ?? ''

</script>

<template>
  <DsfrHeader
    :class="[
      'gps-header',
      'noprint',
      { 'has-modal-ontop': someModalOpen },
    ]"
    :logo-text="logoText"
    :service-title="serviceTitle"
    :service-description="serviceDescription"
    :quick-links="quickLinks"
  >
    <template #mainnav="{ hidemodal }">
      <GpsMainNav
        id="site-menu"
        @route-change="hidemodal"
      />
    </template>
  </DsfrHeader>
</template>
<style scoped>
.gps-header {
  /**
    * When some modal is open, we need to set the footer z-index to -1
    * to avoid the modal to be hidden by the footer
    * We cannot set z-index to -1 everywhere because it would prevent some
    * links in the footer from beeing clicked
   */
  &.has-modal-ontop {
    position: relative;
    z-index: -1;
  }
}
</style>
