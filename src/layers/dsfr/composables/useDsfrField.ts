type DsfrFieldProps = {
  label: string
  placeholder: string
  hint: string
  autocomplete?: string
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
    autocomplete?: string
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
  isValidCondition,
}: {
  props: DsfrFieldProps,
  isValidCondition?: (value: string) => boolean
}): DsfrFieldModel {
  const value = ref('')
  const isError = ref(false)
  const isValid = ref(false)

  const validate = () => {
    nextTick(() => {
      const isValidValue = isValidCondition?.(value.value) ?? null
      if (isValidValue === null) { return }
      if (isValidValue) {
        isError.value = false
        isValid.value = true
      } else {
        isError.value = true
        isValid.value = false
      }
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
    props: {
      label: props.label,
      placeholder: props.placeholder,
      hint: props.hint,
      autocomplete: props.autocomplete,
    },
    errorMessage: computed(() => {
      return (isError.value && props.messages.error) || undefined
    }),
    validMessage: computed(() => {
      return (isValid.value && props.messages.valid) || undefined
    }),
    validate,
    reset,
  }
}
