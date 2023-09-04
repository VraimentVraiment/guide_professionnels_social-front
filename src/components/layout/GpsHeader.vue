<script setup lang="ts">

const headerContent = await queryContent('/components/header').findOne()
const mainNavContent = await queryContent('/components/main-nav').findOne()

const isAuthenticated = await useIsAuthenticated()

const quickLinks = computed(() => {
  return []

  /**
   * @todo Add quick links when 'account' page is set up
   */
  // return headerContent.props.quickLinks
  //   ?.filter((quickLink: {
  //   to: string
  //   label: string
  //   icon?: boolean
  //   public?: boolean
  // }) => {
  //     return isAuthenticated.value || quickLink.public
  //   })
})

const contentNavItems = computed(() => {
  return mainNavContent.props.navItems
    ?.filter((navItem: {
      to: string
      text: string
      public?: boolean
    }) => {
      return isAuthenticated.value || navItem.public
    })
})

/**
 * @todo issue here, this should be fetched again on route change
 */
const directusNavItems = await useFetchMainNav()

const navItems = computed(() => {
  return [
    ...contentNavItems.value,
    ...directusNavItems,
  ]
})

</script>

<template>
  <DsfrHeader
    :class="[
      'gps-header',
      'noprint'
    ]"
    :logo-text="headerContent.props.logoText"
    :service-title="headerContent.props.serviceTitle"
    :service-description="headerContent.props.serviceDescription"
    :quick-links="quickLinks"
  >
    <ClientOnly>
      <DsfrNavigation
        v-if="navItems.length > 0"
        :nav-items="navItems"
      />
    </ClientOnly>
  </DsfrHeader>
</template>
