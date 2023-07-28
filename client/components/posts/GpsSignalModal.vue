<script setup lang="ts">

import {
  type DirectusNotificationObject,
} from 'nuxt-directus/dist/runtime/types'

const rolesIds = {
  admin: 'bf383d1c-33e1-4b93-bf10-d5d179489b0c',
  superAdmin: '236ca5a2-d117-470a-abdf-f905bd2d208d',
  author: '445cf830-f3b7-4abe-b9c7-a0cf9ba7c6d5',
}
const { createNotification } = useDirectusNotifications()

const {
  sendButtonLabel,
  signalButtonLabel,
  modalTitle,
  messageContentProps,
  messageObjectProps,
} = await queryContent('/signal-modal').findOne()

const messageObject = ref()
const messageContent = ref('')
const isModalOpen = ref(false)

const isValidMessage = computed(() => {
  return (
    messageContent.value.length === 0 || (
      messageContent.value.length >= messageContentProps.minLength &&
        messageContent.value.length <= messageContentProps.maxLength
    )
  )
})

const open = () => {
  isModalOpen.value = true
}

const close = () => {
  isModalOpen.value = false
}

const send = () => {
  const notification: DirectusNotificationObject = {
    recipient: rolesIds.admin,
    subject: messageObject.value,
    message: messageContent.value,
  }
  createNotification({ notification })
    .then(() => {
      messageObject.value = null
      messageContent.value = ''
      close()
    })
    // .catch((error) => {
    //   console.error(error)
    // })
}

</script>

<template>
  <DsfrButton
    class="fr-mt-8v"
    icon="ri-alarm-warning-line"
    icon-right
    :label="signalButtonLabel"
    secondary
    @click="() => open()"
  />
  <DsfrModal
    :title="modalTitle"
    icon="ri-alarm-warning-line"
    :opened="isModalOpen"
    @close="() => close()"
  >
    <DsfrSelect
      v-model="messageObject"
      :label="messageObjectProps.label"
      :options="messageObjectProps.list"
      :required="true"
    />
    <DsfrInputGroup
      v-model="messageContent"
      :label="messageContentProps.label"
      :placeholder="messageContentProps.placeholder"
      is-textarea
      label-visible
      :required="true"
      :error-message="!isValidMessage ? messageContentProps.errorMessage : null"
    />
    <DsfrButton
      :label="sendButtonLabel"
      icon="ri-send-plane-line"
      icon-right
      :disabled="!messageObject || messageContent.length === 0 || !isValidMessage"
      @click="() => send()"
    />
  </DsfrModal>
</template>
