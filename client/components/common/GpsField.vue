<script lang="ts" setup>

defineProps<{
  type: string
  field: FieldModel
}>()

</script>

<template>
  <DsfrInputGroup
    v-bind="{ type, ...field.props }"
    :error-message="field.errorMessage.value"
    :valid-message="field.validMessage.value"
    aria-required
    label-visible
  />
</template>
