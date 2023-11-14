import { useScheme } from '@gouvminint/vue-dsfr'

export async function useWithLightScheme(
  callback: () => void | Promise<void>,
) {
  const { theme, setScheme } = useScheme()
  const isDarkMode = theme.value === 'dark'
  if (isDarkMode) {
    setScheme('light')
  }
  await nextTick()
  await callback()
  if (isDarkMode) {
    setScheme('dark')
  }
}
