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
  <div class="gps-auth--form-container">
    <form>
      <DsfrFieldset
        v-bind="fieldSet"
        :class="[{
          'gps-auth--error': isError
        }]"
      >
        <DsfrAlert
          v-show="alertModel.display.value"
          v-bind="alertModel.props.value"
          small
          class="fr-mb-4v"
        />
        <GpsField
          v-model="email.value.value"
          :field="email"
          type="email"
          @input="() => {
            email.validate()
            alertModel.reset()
          }"
        />
        <GpsField
          v-model="password.value.value"
          :field="password"
          type="password"
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
        class="fr-mt-2v"
        :buttons="[
          {
            type: 'button',
            label: submitButtonModel.label,
            icon: 'ri-arrow-right-line',
            iconRight: true,
            disabled: submitButtonModel.disabled.value,
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
.gps-auth--form-container {
  background-color: var(--background-default-grey);
  border: solid 1px var(--border-default-grey);
  box-shadow: 0 6px 18px 0 rgb(0 0 18 / 16%) !important;
  padding: 2rem;

  .gps-auth--error .fr-input-group {
    animation: shake 0.6s cubic-bezier(.36, .07, .19, .97) both;
  }
}
</style>
