<script setup lang="ts">

const content = await queryContent('/components/header').findOne()

const quickLinks = computed(() => {
  return []

  /**
   * @todo Add quick links when 'account' page is set up
   */
  // return content.props.quickLinks
  //   ?.filter((quickLink: {
  //   to: string
  //   label: string
  //   icon?: boolean
  //   public?: boolean
  // }) => {
  //     return isAuthenticated.value || quickLink.public
  //   })
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
    <ClientOnly>
      <GpsMainNav />
    </ClientOnly>
  </DsfrHeader>
</template>
