export function useModalModel(name: string) {
  const isOpen = ref(false)

  const {
    add: addModal,
    remove: removeModal,
  } = useSomeModalOpen()

  const open = () => {
    isOpen.value = true
    addModal(name)
  }

  const close = () => {
    isOpen.value = false
    removeModal(name)
  }

  return {
    isOpen,
    open,
    close,
  }
}
