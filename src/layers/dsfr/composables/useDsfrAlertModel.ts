type DsfrAlertType = 'error' | 'success' | 'info' | 'warning'

type DsfrAlertContent = {
  title: string
  description: string
}

type DsfrAlertModel = {
  display: Ref<boolean>
  props: ComputedRef<{
    title?: string
    description: string
    type?: DsfrAlertType
  }>
  show: (type: DsfrAlertType) => void
  reset: () => void
  setStep: (newStep: number | string) => void
}

/**
 * Provide reactive methods to manage the state of an alert component in DSFR.
 * @see https://vue-dsfr.netlify.app/?path=/docs/composants-dsfralert--docs
 */
export function useDsfrAlertModel(
  strings: Record<DsfrAlertType, DsfrAlertContent | DsfrAlertContent[] | Record<string, DsfrAlertContent>>,
): DsfrAlertModel {
  const display = ref(false)
  const step = ref<string | number | null>(null)
  const messageType = ref<DsfrAlertType>()

  const props = computed(() => {
    const type = messageType.value

    if (!type) {
      return { description: '' }
    }

    const isArray = Array.isArray(strings[type])
    const isObject = !isArray && typeof strings[type] === 'object'

    if (isArray && typeof step.value !== 'number') {
      step.value = 0
    }
    const content = isArray
      ? (strings[type] as DsfrAlertContent[])[step.value as number]
      : isObject
        ? (strings[type] as Record<string, DsfrAlertContent>)[step.value as string]
        : strings[type] as DsfrAlertContent

    return {
      type: messageType.value,
      title: content?.title,
      description: content?.description || '',
    }
  })

  const show = (
    type: DsfrAlertType = 'info',
  ): void => {
    display.value ||= true
    messageType.value = type
  }

  const reset = (): void => {
    display.value = false
    messageType.value = undefined
  }

  const setStep = (
    newStep: number | string,
  ): void => {
    step.value = newStep
  }

  return {
    display,
    props,
    show,
    reset,
    setStep,
  }
}
