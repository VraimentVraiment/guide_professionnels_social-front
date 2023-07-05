export async function useGpsAuth () {
  const isError = ref(false)
  const rememberMe = ref(false)

  const strings = await useGetContent('login')

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

  const submitButtonModel = {
    label: strings.loginButton.label,
    disabled: computed(() => !email.isValid.value || !password.isValid.value),
  }

  const alertModel = useDsfrAlertModel(strings.messages)

  const submit = () => {
    const {
      login: directusLogin,
      // logout: directusLogout,
      // requestPasswordReset,
      // resetPassword,
    } = useDirectusAuth()

    if (!email.isValid.value || !password.isValid.value) {
      return
    }

    isError.value &&= false

    alertModel.show('info')

    directusLogin({
      email: email.value.value,
      password: password.value.value,
    }).then(() => {
      alertModel.show('success')
      navigateTo('/')
      if (rememberMe.value) {
        /**
         * @todo Implement remember me
         */
      }
    })
      .catch(() => {
        isError.value = true
        alertModel.show('error')
        email.reset()
        password.reset()
      })
  }

  const setRememberMe = (value: boolean) => {
    rememberMe.value = value
  }

  return {
    isError,
    rememberMe,
    fieldSet: strings.fieldSet,
    email,
    password,
    submitButtonModel,
    alertModel,
    submit,
    setRememberMe,
  }
}
