<script setup lang="ts">
import { computedAsync } from '@vueuse/core'

const emit = defineEmits(['route-change'])

const content = await queryContent('/components/main-nav').findOne() as unknown as {
  props: {
    navItems: DsfrNavigationMenuLinkProps[]
  }
}

const route = useRoute()

watch(() => route.fullPath, () => {
  emit('route-change')
})

const isAuthenticated = await useIsAuthenticated()

const directusNavItems = computedAsync(async() => {
  return await useFetchMainNav(isAuthenticated.value)
}, [])

const contentNavItems = computed(() => {
  return content.props.navItems
    ?.filter((navItem: DsfrNavigationMenuLinkProps & { public?: boolean }) => {
      return isAuthenticated.value || navItem.public
    })
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
