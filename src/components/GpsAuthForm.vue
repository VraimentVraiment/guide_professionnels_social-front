<script setup lang="ts">

const {
  fieldSet,
  email,
  password,
  submitButtonModel,
  alertModel,
  // setRememberMe,
  submit,
  isError,
} = await useGpsAuth()

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
        v-bind="fieldSet"
        :class="[{
          'gps-auth__error': isError
        }]"
      >
        <DsfrInputGroup2
          v-bind="email.props"
          v-model="email.value.value"
          type="email"
          :error-message="email.errorMessage?.value"
          :valid-message="email.validMessage?.value"
          aria-required="true"
          label-visible
          @input="() => {
            email.validate()
            alertModel.reset()
          }"
        />
        <DsfrInputGroup2
          v-bind="password.props"
          v-model="password.value.value"
          type="password"
          :error-message="password.errorMessage?.value"
          :valid-message="password.validMessage?.value"
          aria-required="true"
          label-visible
          autocomplete="current-password"
          @input="() => {
            password.validate()
            alertModel.reset()
          }"
          @keydown.enter="() => submit()"
        />
        <!-- <DsfrCheckbox
        name="rememberMe"
        label="Se souvenir de moi"
        @update:model-value="(value: boolean) => setRememberMe(value)"
      /> -->
      </DsfrFieldset>
      <DsfrButtonGroup
        :class="[
          'fr-mt-2v'
        ]"
        :buttons="[
          {
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
        // {
        //   label: 'Mot de passe oublié ?',
        //   icon: 'ri-question-line',
        //   iconRight: true,
        //   type: 'button',
        //   secondary: true,
        //   onClick: () => {
        //     alertModel.reset()
        //     $router.push('/forgot-password')
        //   }
        // }
        ]"
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
