export function useInfoMessage (
  strings: RecursiveYmlContent,
): InfoMessageModel {
  const display = ref(false)

  const props = ref({})

  const messageType = ref<InfoMessageTypes | null>(null)

  const contentProps = computed(() => {
    return strings[<InfoMessageTypes>messageType.value] as {
      title: string
      description: string
    }
  })

  const show = (
    type: InfoMessageTypes,
  ): void => {
    display.value = true
    messageType.value = type
    props.value = {
      type: messageType,
      title: contentProps.value.title,
      description: contentProps.value.description,
    }
  }

  const reset = (): void => {
    display.value = false
    messageType.value = null
    props.value = {}
  }

  return {
    display,
    props,
    show,
    reset,
  }
}
