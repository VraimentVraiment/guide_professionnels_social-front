export const getLocaleDate = (date: string) => {
  const dateObj = new Date(date)
  return dateObj.toLocaleDateString('fr-FR')
}
