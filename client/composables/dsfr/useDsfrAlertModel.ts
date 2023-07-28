type InfoMessageTypes = 'error' | 'success' | 'info'

type AlertContent = {
  title: string
  description: string
}

type DsfrAlertModel = {
  display: Ref<boolean>
  props: ComputedRef<AlertContent & {
    type?: InfoMessageTypes
  } | null>
  show: (type: InfoMessageTypes) => void
  reset: () => void
  setStep: (newStep: number) => void
}

/**
 * Provide reactive methods to manage the state of an alert component in DSFR.
 * @see https://vue-dsfr.netlify.app/?path=/docs/composants-dsfralert--docs
 */
export function useDsfrAlertModel(
  strings: Record<InfoMessageTypes, AlertContent | AlertContent[]>,
): DsfrAlertModel {
  const display = ref(false)
  const step = ref(0)
  const messageType = ref<InfoMessageTypes>()

  const props = computed(() => {
    const type = messageType.value

    if (!type) {
      return null
    }
    const content = Array.isArray(strings[type])
      ? (strings[type] as AlertContent[])[step.value]
      : strings[type] as AlertContent

    return {
      type: messageType.value,
      title: content?.title,
      description: content?.description,
    }
  })

  const show = (
    type: InfoMessageTypes = 'info',
  ): void => {
    display.value ||= true
    messageType.value = type
  }

  const reset = (): void => {
    display.value = false
    messageType.value = undefined
  }

  const setStep = (
    newStep: number,
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
