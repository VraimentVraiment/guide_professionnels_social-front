<script lang="ts" setup>

const {
  fieldSet,
  email,
  password,
  button,
  infoMessage,
  submit,
  isError,
} = await useGpsLogin()

</script>

<template>
  <div class="gps-auth">
    <DsfrFieldset
      v-bind="fieldSet"
      :class="[{
        'gps-auth--error': isError
      }]"
    >
      <DsfrAlert
        v-show="infoMessage.display.value"
        v-bind="infoMessage.props.value"
        small
      />
      <GpsField
        v-model="email.value.value"
        :field="email"
        type="email"
        @input="() => {
          email.validate()
          infoMessage.reset()
        }"
      />
      <GpsField
        v-model="password.value.value"
        :field="password"
        type="password"
        @input="() => {
          password.validate()
          infoMessage.reset()
        }"
        @keydown.enter="submit()"
      />
      <DsfrCheckbox
        name="rememberMe"
        label="Se souvenir de moi"
      />
      <DsfrButton
        type="submit"
        :label="button.label"
        :disabled="button.disabled.value"
        :icon="'ri-arrow-right-line'"
        primary
        icon-right
        @click="submit()"
      />
    </DsfrFieldset>
  </div>
</template>

<style>
.gps-auth--error .fr-input-group {
  animation: shake 0.6s cubic-bezier(.36, .07, .19, .97) both;
}

@keyframes shake {

  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>
