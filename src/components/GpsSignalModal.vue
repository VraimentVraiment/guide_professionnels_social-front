<script setup lang="ts">

const props = withDefaults(defineProps<{
  getMessageContent:(content: string) => string
}>(), {
  getMessageContent: (content: string) => content,
})

const content = await queryContent('/components/signal-modal').findOne()

const messageObject = ref(null)
const messageContent = ref('')
const isModalOpen = ref(false)

const isValidMessage = computed(() => {
  return (
    messageContent.value.length === 0 || (
      messageContent.value.length >= content.messageContentProps.minLength &&
      messageContent.value.length <= content.messageContentProps.maxLength
    )
  )
})

const recipientIds = await useGetNotificationRecipientIds()
const { createNotification } = useDirectusNotifications()

const open = () => {
  isModalOpen.value = true
}

const close = () => {
  isModalOpen.value = false
}

const sendNotification = () => {
  if (!recipientIds?.length) {
    return
  }
  Promise.allSettled(
    recipientIds?.map((id) => {
      return createNotification({
        notification: {
          recipient: id,
          subject: messageObject.value as unknown as string,
          message: props.getMessageContent(messageContent.value),
        },
      })
    }),
  )
    .then(() => {
      messageObject.value = null
      messageContent.value = ''
      close()
    })
}

</script>

<template>
  <DsfrButton
    :class="[
      'fr-mt-8v'
    ]"
    icon="ri-alarm-warning-line"
    icon-right
    :label="content.signalButtonLabel"
    secondary
    @click="() => open()"
  />
  <DsfrModal
    :title="content.modalTitle"
    icon="ri-alarm-warning-line"
    :opened="isModalOpen"
    @close="() => close()"
  >
    <DsfrSelect
      v-model="messageObject"
      :label="content.messageObjectProps.label"
      :options="content.messageObjectProps.list"
      required
    />
    <DsfrInputGroup
      v-model="messageContent"
      :label="content.messageContentProps.label"
      :placeholder="content.messageContentProps.placeholder"
      is-textarea
      label-visible
      required
      :error-message="!isValidMessage ? content.messageContentProps.errorMessage : null"
    />
    <DsfrButton
      :label="content.sendButtonLabel"
      icon="ri-send-plane-line"
      icon-right
      :disabled="!messageObject || messageContent.length === 0 || !isValidMessage"
      @click="() => sendNotification()"
    />
  </DsfrModal>
</template>
