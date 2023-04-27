export async function useGpsLogin (): Promise<GpsLogin> {
  const strings = await useGetContent('login') as GpsLoginStrings

  const email = useDsfrField({
    strings: strings.emailField,
    isValidCondition: (value) => {
      return isStringValidEmail(value)
    },
  })

  const password = useDsfrField({
    strings: strings.passwordField,
    isValidCondition: (value) => {
      return value.length >= 8
    },
  })

  const button = {
    label: strings.loginButton.label,
    disabled: computed(() => !email.isValid.value || !password.isValid.value),
  }

  const infoMessage = useInfoMessage(strings.infoMessage)

  const isError = ref(false)

  const submit = () => {
    if (!email.isValid.value || !password.isValid.value) { return }

    isError.value &&= false

    const { login: directusLogin } = useDirectusAuth()

    infoMessage.show('info')

    directusLogin({
      email: email.value.value,
      password: password.value.value,
    }).then(onSuccess)
      .catch(onError)
  }

  const onSuccess = () => {
    infoMessage.reset() // TODO: this is necessary to provoke a re-render but should not
    infoMessage.show('success')
    navigateTo('/')
  }

  const onError = () => {
    isError.value = true
    infoMessage.show('error')
    email.reset()
    password.reset()
  }

  return {
    isError,
    fieldSet: strings.fieldSet,
    email,
    password,
    button,
    infoMessage,
    submit,
  }
}
