<script setup lang="ts">

const {
  headerProps,
  mainNavProps,
} = await useGetContent('/layout')

const isAuthenticated = useIsAuthenticated()

const quickLinks = computed(() => {
  return []

  /**
   * @todo Add quick links when 'account' page is set up
   */
  // return headerProps.quickLinks
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
  return mainNavProps.navItems
    ?.filter((navItem: {
      to: string
      text: string
      public?: boolean
    }) => {
      return isAuthenticated.value || navItem.public
    })
})

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
    :logo-text="headerProps.logoText"
    :service-title="headerProps.serviceTitle"
    :service-description="headerProps.serviceDescription"
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
