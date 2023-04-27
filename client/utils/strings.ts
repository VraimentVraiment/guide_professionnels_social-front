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
