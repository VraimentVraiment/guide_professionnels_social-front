import { useScheme } from '@gouvminint/vue-dsfr'

export function useGpsScheme() {
  const preferences = reactive<{
    theme?: Ref<'light' | 'dark'>
    scheme?: Ref<'auto' | 'light' | 'dark'>
  }>({
    theme: undefined,
    scheme: undefined,
  })

  onMounted(() => {
    const { theme, scheme, setScheme } = useScheme() as {
      theme: Ref<'light' | 'dark'>
      scheme: Ref<'auto' | 'light' | 'dark'>
      setScheme: (scheme: 'auto' | 'light' | 'dark') => void
    }
    preferences.theme = theme.value
    preferences.scheme = scheme.value
    watchEffect(() => {
      preferences.theme = theme.value
    })
    watchEffect(() => {
      preferences.scheme && setScheme(preferences.scheme)
    })
  })

  return {
    preferences,
  }
}
