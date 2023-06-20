const DOMAIN_NAME_BLACKLIST = [
  'yopmail.com',
  'mailinator.com',
]

export function isStringValidEmail (
  string: string,
): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const [, domain] = string.split('@')

  return (
    emailRegex.test(string) &&
    !DOMAIN_NAME_BLACKLIST.includes(domain)
  )
}

export const formatFormat = (format) => {
  return format
    ?.replace('application/', '')
    ?.toUpperCase()
}

export const formatBytes = (
  bytes: number,
  decimals = 2,
): string => {
  if (bytes === 0) { return '0 Bytes' }
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}
