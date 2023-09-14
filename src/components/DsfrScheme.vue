<script setup lang="ts">
import { useScheme } from '@gouvminint/vue-dsfr'

const preferences = reactive({
  theme: undefined,
  scheme: undefined,
})
onMounted(() => {
  const { theme, scheme, setScheme } = useScheme()
  preferences.theme = theme.value
  preferences.scheme = scheme.value
  watchEffect(() => { preferences.theme = theme.value })
  watchEffect(() => setScheme(preferences.scheme))
})

/**
 * @todo setup scheme selection modal
 * https://gouvfr.atlassian.net/wiki/spaces/DB/pages/579928166/Param+tres+d+affichage+-+Display
 */

</script>

<template>
  <div />
</template>
