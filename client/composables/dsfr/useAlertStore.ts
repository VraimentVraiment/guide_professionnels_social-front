export function useAlertStore() {
  const alertTitle = ref('')
  const alertDescription = ref('')
  const alertType = ref('')
  const openAlert = ref(false)

  function closeAlert() {
    openAlert.value = false
  }

  return {
    alertTitle,
    alertDescription,
    alertType,
    openAlert,
    closeAlert,
  }
}