<script setup lang="ts">

const content = await queryContent('/components/header').findOne()

const isAuthenticated = useIsAuthenticated()

const {
  logout: directusLogout,
} = useDirectusAuth()

const systemQuicklinks = [
  {
    to: '/?logout=true',
    label: 'Déconnexion',
    icon: 'ri-logout-box-line',
    public: false
  }
]
const route = useRoute()

watch(() => route.query.logout, async (logout) => {
  if (logout) {
    await directusLogout()
    navigateTo('/')
  }
})

const quickLinks = computed(() => {
  /**
   * @todo Add quick links when 'account' page is set up
   */
  return [
    ...systemQuicklinks,
    ...content.props.quickLinks || []
  ]
    ?.filter((quickLink: {
      to: string
      label: string
      icon?: boolean
      public?: boolean
    }) => {
      return isAuthenticated.value || quickLink.public
    })
})

</script>

<template>
  <DsfrHeader :class="[
    'gps-header',
    'noprint'
  ]" :logo-text="content.props.logoText" :service-title="content.props.serviceTitle"
    :service-description="content.props.serviceDescription" :quick-links="quickLinks">
    <template #mainnav="{ hidemodal }">
      <GpsMainNav id="site-menu" @route-change="hidemodal" />
    </template>
  </DsfrHeader>
</template>
