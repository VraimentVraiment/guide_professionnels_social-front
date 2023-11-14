import { useScheme } from '@gouvminint/vue-dsfr'

export const useGpsSchemeStore = defineStore('gps-scheme', () => {
  const preferences = reactive<{
    theme?: 'light' | 'dark'
    scheme?: 'light' | 'dark' | 'system'
  }>({
    theme: undefined,
    scheme: undefined,
  })

  onMounted(() => {
    const { theme, scheme, setScheme } = useScheme() as {
      theme: Ref<'light' | 'dark'>
      scheme: Ref<'light' | 'dark' | 'system'>
      setScheme: (scheme: 'light' | 'dark' | 'system') => void
    }
    preferences.scheme = scheme.value

    watchEffect(() => { preferences.theme = theme.value })

    watchEffect(() => setScheme(preferences.scheme as 'light' | 'dark' | 'system'))
  })

  return {
    preferences,
  }
})
