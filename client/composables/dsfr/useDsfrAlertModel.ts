type InfoMessageTypes = 'error' | 'success' | 'info'

type DsfrAlertModel = {
  display: Ref<boolean>
  props: ComputedRef<{
    type: InfoMessageTypes | null
    title: string
    description: string
  }>
  show: (type: InfoMessageTypes) => void
  reset: () => void
  setStep: (newStep: number) => void
}

export function useDsfrAlertModel (
  strings: RecursiveYmlContent,
): DsfrAlertModel {
  const display = ref(false)
  const step = ref(0)
  const messageType = ref<InfoMessageTypes | null>(null)

  const props = computed(() => {
    const type = messageType.value as InfoMessageTypes

    const content = Array.isArray(strings[type])
      ? strings[type][step.value]
      : strings[type]

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
    messageType.value = null
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
