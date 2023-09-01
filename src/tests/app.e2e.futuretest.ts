import { fileURLToPath } from 'node:url'
import { setup, $fetch } from '@nuxt/test-utils'

await setup({
  setupTimeout: 10000,
  rootDir: fileURLToPath(new URL('../../', import.meta.url)),
})

describe('app', () => {
  it('runs a test', async() => {
    const html = await $fetch('/login')
    expect(html.slice(0, 20)).toMatchInlineSnapshot(`
      "<!DOCTYPE html>
      <htm"
    `)
  })
})
