export function useSomeModalOpen() {
  const openModals = useState('openModals', () => <string[]>[])

  const add = (modalName: string) => {
    openModals.value.push(modalName)
  }

  const remove = (modalName: string) => {
    openModals.value.splice(openModals.value.indexOf(modalName), 1)
  }

  const someModalOpen = computed(() => {
    return openModals.value.length > 0
  })

  return {
    openModals,
    add,
    remove,
    someModalOpen,
  }
}
