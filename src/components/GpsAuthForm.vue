<script setup lang="ts">

const content = await queryContent('/components/auth').findOne()

const { url: siteUrl } = useSiteConfig()

const {
  login,
  requestPasswordReset,
  resetPassword,
} = useDirectusAuth()

const alertModel = useDsfrAlertModel(content.messages)

const route = useRoute()

const isResetPasswordRequest = ref(false)

const isResetPassword = computed(() => {
  return Boolean(route.query.reset_password === 'true' && route.query.token)
})

const isError = ref(false)

const emailField = useDsfrField({
  props: content.emailField,
  isValidCondition: (value) => {
    return isStringValidEmail(value)
  },
})

if (route.query.mail) {
  emailField.value.value = route.query.mail as string
  emailField.validate()
}

const passwordField = useDsfrField({
  props: content.passwordField,
  isValidCondition: (value) => {
    return value.length >= 8
  },
  isErrorCondition: (value) => {
    return value.length < 8
  },
  showError: isResetPassword,
  showValid: isResetPassword,
})

const repeatPasswordField = useDsfrField({
  props: content.repeatPasswordField,
  isValidCondition: (value) => {
    return value === passwordField.value.value
  },
  isErrorCondition: (value) => {
    return value !== passwordField.value.value
  },
  showError: true,
  showValid: true,
})

async function submitLogin() {
  if (
    isResetPassword.value ||
    isResetPasswordRequest.value ||
    !emailField.isValid.value ||
    !passwordField.isValid.value
  ) {
    return
  }

  isError.value &&= false

  alertModel.setStep('login')
  alertModel.show('info')

  try {
    await login({
      email: emailField.value.value,
      password: passwordField.value.value,
    })
    alertModel.show('success')
    reloadNuxtApp({
      path: '/',
    })
  } catch {
    isError.value = true
    alertModel.show('error')
  } finally {
    passwordField.reset()
  }
}

async function submitPasswordResetRequest() {
  if (
    !isResetPasswordRequest.value ||
    !emailField.isValid.value
  ) {
    return
  }

  try {
    const email = emailField.value.value
    alertModel.setStep('resetEmail')
    alertModel.show('info')
    await requestPasswordReset({
      email,
      reset_url: `${siteUrl}/auth?reset_password=true&mail=${email}`,
    })
    alertModel.show('success')
  } catch {
    alertModel.show('error')
  } finally {
    isResetPasswordRequest.value = false
  }
}

async function submitPasswordReset() {
  if (
    !isResetPassword.value ||
    !passwordField.isValid.value ||
    !repeatPasswordField.isValid.value
  ) {
    return
  }

  try {
    alertModel.setStep('resetPassword')
    alertModel.show('info')
    await resetPassword({
      token: route.query.token as string,
      password: passwordField.value.value,
    })
    alertModel.show('success')
  } catch {
    alertModel.show('error')
  } finally {
    passwordField.reset()
    repeatPasswordField.reset()
    navigateTo(`/auth?mail=${route.query.mail}`)
  }
}

const fieldSetLegend = computed(() => {
  if (isResetPassword.value) {
    return content.fieldSet?.legend?.resetPassword
  } else if (isResetPasswordRequest.value) {
    return content.fieldSet?.legend?.resetEmail
  } else {
    return content.fieldSet?.legend?.login
  }
})

const fieldSetHint = computed(() => {
  if (isResetPassword.value) {
    return content.fieldSet?.hint?.resetPassword
  } else if (isResetPasswordRequest?.value) {
    return content.fieldSet?.hint?.resetEmail
  } else {
    return content.fieldSet?.hint?.login
  }
})

</script>

<template>
  <DsfrAlert
    v-show="alertModel.display.value"
    v-bind="alertModel.props.value"
    small
    :class="[
      'fr-mb-6v',
    ]"
  />
  <div
    :class="[
      'gps-auth__form-container',
      'fr-p-4w',
    ]"
  >
    <form>
      <DsfrFieldset
        :legend="fieldSetLegend"
        :hint="fieldSetHint"
        :class="[{
          'gps-auth__error': isError
        }]"
      >
        <DsfrInputGroup
          v-if="!isResetPassword"
          v-bind="emailField.props"
          v-model="emailField.value.value"
          type="email"
          :error-message="emailField.errorMessage?.value"
          :valid-message="emailField.validMessage?.value"
          aria-required="true"
          label-visible
          @input="() => {
            emailField.validate()
            alertModel.reset()
          }"
          @keydown.enter="submitPasswordResetRequest"
        />
        <DsfrInputGroup
          v-if="!isResetPasswordRequest"
          v-bind="passwordField.props"
          v-model="passwordField.value.value"
          type="password"
          :error-message="passwordField.errorMessage?.value"
          :valid-message="passwordField.validMessage?.value"
          aria-required="true"
          label-visible
          autocomplete="current-password"
          @input="() => {
            passwordField.validate()
            alertModel.reset()
          }"
          @keydown.enter="submitLogin"
        />
        <DsfrInputGroup
          v-if="isResetPassword"
          v-bind="repeatPasswordField.props"
          v-model="repeatPasswordField.value.value"
          type="password"
          :error-message="repeatPasswordField.errorMessage?.value"
          :valid-message="repeatPasswordField.validMessage?.value"
          aria-required="true"
          label-visible
          autocomplete="current-password"
          @input="() => {
            repeatPasswordField.validate()
            alertModel.reset()
          }"
          @keydown.enter="submitPasswordReset"
        />
      </DsfrFieldset>
      <DsfrButtonGroup
        :class="[
          'fr-mt-2v'
        ]"
        :buttons="[
          !isResetPassword && !isResetPasswordRequest && {
            type: 'button',
            label: content.loginButton.label,
            icon: 'ri-arrow-right-line',
            iconRight: true,
            disabled: (
              !emailField.isValid.value ||
              !passwordField.isValid.value
            ),
            onClick: submitLogin
          },
          !isResetPassword && !isResetPasswordRequest && {
            label: content.forgotPasswordButton.label,
            icon: 'ri-question-line',
            iconRight: true,
            type: 'button',
            tertiary: true,
            noOutline: true,
            onClick: () => {
              alertModel.reset()
              isResetPasswordRequest = true
            }
          },
          isResetPasswordRequest && {
            label: content.resetPasswordRequestButton.label,
            icon: 'ri-arrow-right-line',
            iconRight: true,
            type: 'button',
            disabled: !emailField.isValid.value,
            onClick: submitPasswordResetRequest
          },
          isResetPassword && {
            label: content.resetPasswordButton.label,
            icon: 'ri-arrow-right-line',
            iconRight: true,
            type: 'button',
            disabled: !passwordField.isValid.value || !repeatPasswordField.isValid.value,
            onClick: submitPasswordReset
          }
        ]
          .filter(Boolean)
        "
      />
    </form>
  </div>
</template>

<style scoped lang="scss">
.gps-auth__form-container {
  background-color: var(--background-default-grey);
  border: solid 1px var(--border-default-grey);
  box-shadow: 0 6px 18px 0 rgb(0 0 18 / 16%) !important;

  .gps-auth__error .fr-input-group {
    animation: shake 0.6s cubic-bezier(.36, .07, .19, .97) both;
  }
}
</style>
