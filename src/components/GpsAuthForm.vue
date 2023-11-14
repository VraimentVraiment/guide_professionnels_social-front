<script setup lang="ts">

const {
  fieldSet,
  emailField,
  passwordField,
  repeatPassword,
  submitButtonModel,
  alertModel,
  // setRememberMe,
  submit,
  isError,
} = await useGpsAuth()

const EMAIL ='lucas@vraimentvraiment.com'

const {
  requestPasswordReset,
  resetPassword
} = useDirectusAuth();

const { query } = useRoute()
const isResetPassword = Boolean(query.reset_password === 'true' && query.token)
console.log("isResetPassword :", isResetPassword);

</script>

<template>
  <DsfrAlert v-show="alertModel.display.value" v-bind="alertModel.props.value" small :class="[
    'fr-mb-6v',
  ]" />
  <div :class="[
    'gps-auth__form-container',
    'fr-p-4w',
  ]">
    <form>
      <DsfrFieldset v-bind="fieldSet" :class="[{
        'gps-auth__error': isError
      }]">
        <DsfrInputGroup v-bind="emailField.props" v-model="emailField.value.value" type="email"
          :error-message="emailField.errorMessage?.value" :valid-message="emailField.validMessage?.value"
          aria-required="true" label-visible @input="() => {
            emailField.validate()
            alertModel.reset()
          }" />
        <DsfrInputGroup v-bind="passwordField.props" v-model="passwordField.value.value" type="password"
          :error-message="passwordField.errorMessage?.value" :valid-message="passwordField.validMessage?.value"
          aria-required="true" label-visible autocomplete="current-password" @input="() => {
            passwordField.validate()
            alertModel.reset()
          }" @keydown.enter="() => submit()" />
        <DsfrInputGroup v-bind="repeatPassword.props" v-model="repeatPassword.value.value" type="password"
          :error-message="repeatPassword.errorMessage?.value" :valid-message="repeatPassword.validMessage?.value"
          aria-required="true" label-visible autocomplete="current-password" @input="() => {
            repeatPassword.validate()
            alertModel.reset()
          }" @keydown.enter="() => submit()" />
        <!-- <DsfrCheckbox
        name="rememberMe"
        label="Se souvenir de moi"
        @update:model-value="(value: boolean) => setRememberMe(value)"
      /> -->
      </DsfrFieldset>
      <DsfrButtonGroup :class="[
        'fr-mt-2v'
      ]"
      :buttons="[
  !isResetPassword && {
    type: 'button',
    label: submitButtonModel.label,
    icon: 'ri-arrow-right-line',
    iconRight: true,
    disabled: submitButtonModel.disabled?.value,
    onClick: submit
  },
  /**
   * @todo Implement forgot password
   */
    !isResetPassword && {
    label: 'Mot de passe oublié',
    icon: 'ri-question-line',
    iconRight: true,
    type: 'button',
    tertiary: true,
    noOutline: true,
    onClick: () => {
      alertModel.reset()
      requestPasswordReset({
        email: EMAIL,
        reset_url: `http://localhost:3000/login?reset_password=true&mail=${EMAIL}`,
      })
    }
  },
  isResetPassword && {
    label: 'Changer de mot de passe',
    icon: 'ri-arrow-right-line',
    iconRight: true,
    type: 'button',
    tertiary: true,
    // noOutline: true,
    onClick: async () => {
      alertModel.reset()
      try {
        await resetPassword({ token: query.token, password: passwordField.value.value })
      } catch {

      }
    }
  }
]
  .filter(Boolean)
  " />
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
