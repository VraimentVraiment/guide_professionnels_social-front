<script setup lang="ts">

const content = await queryContent('/components/main-nav').findOne()

const isAuthenticated = await useIsAuthenticated()

const contentNavItems = computed(() => {
  return content.props.navItems
    ?.filter((navItem: {
      to: string
      text: string
      public?: boolean
    }) => {
      return isAuthenticated.value || navItem.public
    })
})

/**
 * @todo Fix this, we do not want to fetch the main nav on every route change
 * But if we don't, it will not be updated when user logs in
 */
const directusNavItems = ref<any[]>([])
watch(() => useRoute().fullPath, async() => {
  directusNavItems.value = await useFetchMainNav()
}, {
  immediate: true,
})

const navItems = computed(() => {
  return [
    ...contentNavItems.value,
    ...directusNavItems.value,
  ]
})

</script>

<template>
  <DsfrNavigation
    v-if="navItems.length > 0"
    :nav-items="navItems"
  />
</template>
