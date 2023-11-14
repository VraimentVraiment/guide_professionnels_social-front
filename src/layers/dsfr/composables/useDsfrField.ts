type DsfrFieldProps = {
  label: string
  placeholder: string
  hint: string
  messages: {
    error: string
    valid: string
  }
}

export type DsfrFieldModel = {
  value: Ref<string>
  isError: Ref<boolean>
  isValid: Ref<boolean>
  props: {
    label?: string
    placeholder?: string
    hint?: string
  }
  errorMessage: ComputedRef<string | undefined>
  validMessage: ComputedRef<string | undefined>
  validate: () => void
  reset: () => void
}

/**
 * A model for the DSFR field.
 */
export function useDsfrField({
  props,
  showValid = false,
  showError = false,
  isValidCondition,
  isErrorCondition,
}: {
  props: DsfrFieldProps,
  showValid?: boolean | Ref<boolean>,
  showError?: boolean | Ref<boolean>,
  isValidCondition?: (value: string) => boolean
  isErrorCondition?: (value: string) => boolean
}): DsfrFieldModel {
  const value = ref('')
  const isError = ref(false)
  const isValid = ref(false)

  const validate = () => {
    nextTick(() => {
      isError.value = isErrorCondition?.(value.value) ?? false
      isValid.value = isValidCondition?.(value.value) ?? false
    })
  }

  const reset = () => {
    isError.value = false
    isValid.value = false
    value.value = ''
  }

  return {
    value,
    isError,
    isValid,
    props,
    errorMessage: computed(() => {
      return (
        isError.value &&
        unref(showError) &&
        props.messages.error
      ) || undefined
    }),
    validMessage: computed(() => {
      return (
        isValid.value &&
        unref(showValid) &&
        props.messages.valid
      ) || undefined
    }),
    validate,
    reset,
  }
}
