<script setup lang="ts">

const emit = defineEmits(['route-change'])

const mainNavStore = useMainNavStore()
mainNavStore.init()

const route = useRoute()

watch(() => route.fullPath, () => {
  emit('route-change')
})

</script>

<template>
  <DsfrNavigation
    v-if="mainNavStore.navItems?.length > 0"
    :nav-items="mainNavStore.navItems"
  />
</template>
