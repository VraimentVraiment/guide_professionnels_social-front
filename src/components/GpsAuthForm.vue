<script setup lang="ts">

import type { DsfrButtonProps } from '@gouvminint/vue-dsfr/types/components/DsfrButton/DsfrButton.vue'

const content = await queryContent('/components/auth').findOne()

const {
  url: siteUrl,
} = useRuntimeConfig().public.site

const {
  login,
  requestPasswordReset,
  resetPassword,
} = useDirectusAuth()

const alertModel = useDsfrAlertModel(content.messages)

const route = useRoute()

const isResetPasswordRequest = computed(() => {
  return route.query.request_password_reset === 'true'
})

const isResetPassword = computed(() => {
  return Boolean(
    route.query.reset_password === 'true' &&
    route.query.token,
  )
})

const isError = ref(false)

const isLoginRejected = ref(false)

const { messages: emailMessages, ...emailProps } = content.emailField

const emailField = useDsfrField({
  props: {
    ...emailProps,
    messages: {
      ...emailMessages,
      error: computed(() => {
        return isLoginRejected.value ? content.messages.error.login.description : emailMessages.error
      }),
    },
  },
  showError: computed(() => {
    return isLoginRejected.value
  }),
  isValidCondition: (value) => {
    return isStringValidEmail(value)
  },
  isErrorCondition: () => {
    return isLoginRejected.value
  },
})

if (route.query.mail) {
  emailField.value.value = route.query.mail as string
  emailField.validate()
}

const { messages: passwordMessages, ...passwordProps } = content.passwordField

const passwordField = useDsfrField({
  props: {
    ...passwordProps,
    messages: {
      ...passwordMessages,
      error: computed(() => {
        return isLoginRejected.value ? content.messages.error.login.description : passwordMessages.error
      }),
    },
  },
  isValidCondition: (value) => {
    return value.length >= 8
  },
  isErrorCondition: (value) => {
    return isLoginRejected.value || value.length < 8
  },
  showError: computed(() => {
    return isLoginRejected.value || isResetPassword.value
  }),
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
    isLoginRejected.value = true
    passwordField.validate()
    emailField.validate()
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
    const params = new URLSearchParams()
    params.set('mail', email)
    params.set('reset_password', 'true')
    await requestPasswordReset({
      email,
      reset_url: `${siteUrl}/auth?${params.toString()}`,
    })
    alertModel.show('success')
  } catch {
    alertModel.show('error')
  } finally {
    navigateTo('/auth')
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
    const params = new URLSearchParams()
    params.set('mail', route.query.mail as string)
    navigateTo(`/auth?${params.toString()}`)
  }
}

const loginButtonProps = computed(() => {
  return {
    type: 'button',
    label: content.loginButton.label,
    icon: 'ri-arrow-right-line',
    name: 'login',
    iconRight: true,
    disabled: (
      !emailField.isValid.value ||
      !passwordField.isValid.value
    ),
    onClick: submitLogin,
  }
})

const resetPasswordRequestButtonProps = computed(() => {
  return {
    label: content.resetPasswordRequestButton.label,
    icon: 'ri-arrow-right-line',
    iconRight: true,
    type: 'button',
    name: 'reset-password-request',
    disabled: !emailField.isValid.value,
    onClick: submitPasswordResetRequest,
  }
})

const resetPasswordButtonProps = computed(() => {
  return {
    label: content.resetPasswordButton.label,
    icon: 'ri-arrow-right-line',
    iconRight: true,
    type: 'button',
    disabled: !passwordField.isValid.value || !repeatPasswordField.isValid.value,
    onClick: submitPasswordReset,
  }
})

const authButtons = computed(() => {
  const buttons: DsfrButtonProps[] = []
  if (!isResetPassword.value && !isResetPasswordRequest.value) {
    buttons.push(loginButtonProps.value)
  }
  if (isResetPasswordRequest.value) {
    buttons.push(resetPasswordRequestButtonProps.value)
  }
  if (isResetPassword.value) {
    buttons.push(resetPasswordButtonProps.value)
  }
  return buttons
})

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

const showPasswords = ref(false)

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
          :error-message="emailField.errorMessage?.value"
          :valid-message="emailField.validMessage?.value"
          type="email"
          name="email"
          aria-required="true"
          autocomplete="email"
          label-visible
          @input="() => {
            isLoginRejected = false
            emailField.validate()
            alertModel.reset()
            isLoginRejected = false
          }"
          @keydown.enter="submitPasswordResetRequest"
        />
        <DsfrInputGroup
          v-if="!isResetPasswordRequest"
          v-bind="passwordField.props"
          v-model="passwordField.value.value"
          :error-message="passwordField.errorMessage?.value"
          :valid-message="passwordField.validMessage?.value"
          :type="showPasswords ? 'text' : 'password'"
          name="password"
          aria-required="true"
          autocomplete="current-password"
          label-visible
          @input="() => {
            isLoginRejected = false
            passwordField.validate()
            alertModel.reset()
          }"
          @keydown.enter="submitLogin"
        />
        <DsfrCheckbox
          v-if="!isResetPasswordRequest"
          :class="[
            'gps-auth__show-password',
          ]"
          name="show-password"
          label="Afficher"
          small
          :model-value="showPasswords"
          @update:model-value="showPasswords = $event"
        />
        <NuxtLink
          v-if="!isResetPassword && !isResetPasswordRequest"
          :to="{
            name: 'auth',
            query: {
              request_password_reset: 'true',
              mail: emailField.value.value,
            },
          }"
          :class="[
            'gps-auth__forgot-password',
            'fr-link',
          ]"
          @click="() => {
            alertModel.reset()
          }"
        >
          {{ content.forgotPasswordButton.label }}
        </NuxtLink>
        <DsfrInputGroup
          v-if="isResetPassword"
          v-bind="repeatPasswordField.props"
          v-model="repeatPasswordField.value.value"
          :error-message="repeatPasswordField.errorMessage?.value"
          :valid-message="repeatPasswordField.validMessage?.value"
          :type="showPasswords ? 'text' : 'password'"
          name="repeat-password"
          aria-required="true"
          autocomplete="current-password"
          label-visible
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
        :buttons="authButtons"
      />
    </form>
  </div>
</template>

<style scoped lang="scss">
.gps-auth__form-container {
  background-color: var(--background-default-grey);
  border: solid 1px var(--border-default-grey);
  filter: drop-shadow(var(--overlap-shadow));

  .gps-auth__error .fr-input-group {
    animation: shake 0.6s cubic-bezier(.36, .07, .19, .97) both;
  }
}

.gps-auth__show-password {
  position: absolute;
  right: 1rem;
  transform: translateY(-6rem);
  z-index: 10;
}
</style>
