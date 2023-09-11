/* eslint-disable no-console */

export function warn(
  message: string,
): void {
  const allowWarn = true

  if (
    !allowWarn ||
    String(process.env?.TEST) === 'true'
  ) {
    return
  }

  console.warn(`[gps14] ${message}`)
}
