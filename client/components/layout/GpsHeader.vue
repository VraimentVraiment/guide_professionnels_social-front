<script setup lang="ts">

const {
  headerProps,
  mainNavProps,
} = await useGetContent('/layout')

const isAuthenticated = useIsAuthenticated()

const quickLinks = computed(() => {
  return headerProps.quickLinks
    ?.filter((quickLink: {
    to: string
    label: string
    icon?: boolean
    public?: boolean
  }) => {
      return isAuthenticated.value || quickLink.public
    })
})

const navItems = computed(() => {
  return mainNavProps.navItems
    ?.filter((navItem: {
      to: string
      text: string
      public?: boolean
    }) => {
      return isAuthenticated.value || navItem.public
    })
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
    <DsfrNavigation
      v-if="navItems.length > 0"
      :nav-items="navItems"
    />
  </DsfrHeader>
</template>
