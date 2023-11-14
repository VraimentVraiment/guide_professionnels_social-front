<script setup lang="ts">

const content = await queryContent('/components/header').findOne()

const isAuthenticated = useIsAuthenticated()

const quickLinks = computed(() => {
  return content.props.quickLinks
    ?.filter((quickLink: GpsQuickLink) => {
      return isAuthenticated.value || quickLink.public
    }) || []
})

</script>

<template>
  <DsfrHeader
    :class="[
      'gps-header',
      'noprint'
    ]"
    :logo-text="content.props.logoText"
    :service-title="content.props.serviceTitle"
    :service-description="content.props.serviceDescription"
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
