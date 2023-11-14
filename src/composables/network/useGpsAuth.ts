/**
 * A composable that provides a model for the login form,
 * based on the DSFR form model and the Directus auth API.
 */
export async function useGpsAuth() {
  const isError = ref(false)
  const rememberMe = ref(false)

  const content = await queryContent('/components/login').findOne()

  const emailField = useDsfrField({
    props: content.emailField,
    isValidCondition: (value) => {
      return isStringValidEmail(value)
    },
    // isErrorCondition: (value) => {
    //   return !isStringValidEmail(value)
    // }
  })

  const passwordField = useDsfrField({
    props: content.passwordField,
    isValidCondition: (value) => {
      return value.length >= 8
    },
    // isErrorCondition: (value) => {
    //   return value.length < 8
    // }
  })

  const repeatPassword = useDsfrField({
    props: content.repeatPasswordField,
    isValidCondition: (value) => {
      return value === passwordField.value.value
    },
    // isErrorCondition: (value) => {
    //   return value !== passwordField.value.value
    // }
  })

  const submitButtonModel = {
    label: content.loginButton.label,
    disabled: computed(() => {
      return (
        !emailField.isValid.value ||
        !passwordField.isValid.value
      )
    }),
  }

  const alertModel = useDsfrAlertModel(content.messages)

  const submit = () => {
    const {
      login: directusLogin,
      // logout: directusLogout,
      // requestPasswordReset,
      // resetPassword,
    } = useDirectusAuth()

    if (!emailField.isValid.value || !passwordField.isValid.value) {
      return
    }

    isError.value &&= false

    alertModel.show('info')

    directusLogin({
      email: emailField.value.value,
      password: passwordField.value.value,
    }).then(() => {
      alertModel.show('success')
      reloadNuxtApp({
        path: '/',
      })
      if (rememberMe.value) {
        /**
         * @todo Implement remember me
         */
      }
    })
      .catch(() => {
        isError.value = true
        alertModel.show('error')
        emailField.reset()
        passwordField.reset()
      })
  }

  const setRememberMe = (value: boolean) => {
    rememberMe.value = value
  }

  return {
    isError,
    rememberMe,
    fieldSet: content.fieldSet,
    emailField,
    passwordField,
    repeatPassword,
    submitButtonModel,
    alertModel,
    submit,
    setRememberMe,
  }
}
