<script setup lang="ts">

const content = await queryContent('/components/header').findOne()

const isAuthenticated = useIsAuthenticated()

const {
  serviceTitle,
  serviceDescription,
  logoText,
} = appConfigPatch as unknown as Required<{
// } = useAppConfig() as unknown as Required<{
  serviceTitle: string
  serviceDescription: string
  logoText: string
}>

const quickLinks = computed(() => {
  return content.quickLinks
    ?.filter((quickLink: GpsQuickLink) => {
      return isAuthenticated.value || quickLink.public
    }) ?? []
})

const { someModalOpen } = useSomeModalOpen()

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
    show-search
    search-label="Rechercher sur le site"
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
