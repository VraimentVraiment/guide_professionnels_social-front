import '@testing-library/jest-dom'
import { vi } from 'vitest'

window.matchMedia = function () {
  return { matches: false } as MediaQueryList
}

vi.mock('#imports', () => ({
  definePageMeta: () => {},
}))
