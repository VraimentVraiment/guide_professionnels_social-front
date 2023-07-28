const DOMAIN_NAME_BLACKLIST = [
  'yopmail.com',
  'mailinator.com',
]

/**
 * Given a string, return a boolean indicating whether it is a valid email address.
 */
export function isStringValidEmail(
  string: string,
): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const [, domain] = string.split('@')

  return (
    emailRegex.test(string) &&
    !DOMAIN_NAME_BLACKLIST.includes(domain)
  )
}

/**
 * Given a string describing a file format, return a string with the first letter capitalized.
 */
export const formatFileFormat = (
  fileFormat: string,
): string => {
  const result = fileFormat
    ?.replace('application/', '')
    ?.toUpperCase()

  return result ?? ''
}

/**
 * Given a number of bytes, return a string with the number of bytes and the unit.
 */
export const formatBytes = (
  bytes: number,
  decimals = 2,
): string => {
  if (bytes === 0) { return '0 Bytes' }

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  const value = parseFloat((bytes / Math.pow(k, i)).toFixed(dm))
  const unit = sizes[i]

  return `${value} ${unit}`
}
