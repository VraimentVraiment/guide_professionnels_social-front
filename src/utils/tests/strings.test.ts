describe('isStringValidEmail', () => {
  it('returns true for a valid email address', () => {
    expect(isStringValidEmail('test@example.com')).toBe(true)
  })

  it('returns false for an invalid email address', () => {
    expect(isStringValidEmail('test@example')).toBe(false)
  })

  it('returns false for an email address with a blacklisted domain', () => {
    expect(isStringValidEmail('test@yopmail.com')).toBe(false)
  })
})

describe('formatFileFormat', () => {
  it('returns an empty string for null input', () => {
    expect(formatFileFormat(null)).toBe('')
  })

  it('capitalizes the first letter of the file format', () => {
    expect(formatFileFormat('application/pdf')).toBe('PDF')
  })
})

describe('formatBytes', () => {
  it('returns "0 Bytes" for null input', () => {
    expect(formatBytes(null)).toBe('0 Bytes')
  })

  it('returns the correct value and unit for bytes', () => {
    expect(formatBytes(1024)).toBe('1 KB')
    expect(formatBytes(1024 * 1024)).toBe('1 MB')
    expect(formatBytes(1024 * 1024 * 1024)).toBe('1 GB')
  })

  it('rounds the value to the specified number of decimals', () => {
    expect(formatBytes(1024 * 1024 * 1.3, 0)).toBe('1 MB')
    expect(formatBytes(1024 * 1024 * 1.3, 1)).toBe('1.3 MB')
  })
})
