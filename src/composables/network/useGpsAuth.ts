/**
 * A composable that provides a model for the login form,
 * based on the DSFR form model and the Directus auth API.
 */
export async function useGpsAuth() {
  const isError = ref(false)
  const rememberMe = ref(false)

  const content = await queryContent('/components/login').findOne()

  const email = useDsfrField({
    props: content.emailField,
    isValidCondition: (value) => {
      return isStringValidEmail(value)
    },
  })

  const password = useDsfrField({
    props: content.passwordField,
    isValidCondition: (value) => {
      return value.length >= 8
    },
  })

  const submitButtonModel = {
    label: content.loginButton.label,
    disabled: computed(() => !email.isValid.value || !password.isValid.value),
  }

  const alertModel = useDsfrAlertModel(content.messages)

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
      reloadNuxtApp()
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
    fieldSet: content.fieldSet,
    email,
    password,
    submitButtonModel,
    alertModel,
    submit,
    setRememberMe,
  }
}
