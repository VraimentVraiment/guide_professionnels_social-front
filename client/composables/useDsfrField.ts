type GpsFieldStrings = {
  label: string
  placeholder: string
  hint: string
  autocomplete?: string
  messages: {
    error: string
    valid: string
  }
}

/**
 * A model for the DSFR field.
 */
export function useDsfrField({
  strings,
  isValidCondition,
}: {
  strings: GpsFieldStrings,
  isValidCondition?: (value: string) => boolean
}): FieldModel {
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
      label: strings.label,
      placeholder: strings.placeholder,
      hint: strings.hint,
      autocomplete: strings.autocomplete,
    },
    errorMessage: computed(() => {
      return (isError.value && strings.messages.error) || undefined
    }),
    validMessage: computed(() => {
      return (isValid.value && strings.messages.valid) || undefined
    }),
    validate,
    reset,
  }
}
