// @vitest-environment nuxt

import { mockNuxtImport, renderSuspended } from 'nuxt-vitest/utils'
import { expect, it, describe } from 'vitest'
import { GpsSiteBanner } from '#components'

mockNuxtImport('useAppConfig', () => {
  return () => ({
    serviceTitleMultiline: ['Welcome to', 'My Site'],
    serviceDescription: 'This is a test site',
  })
})

describe('GpsSiteBanner', () => {
  it('renders the title and baseline text', async() => {
    const wrapper = await renderSuspended(GpsSiteBanner)
    expect(wrapper.getByText('Welcome to').parentElement?.tagName).toBe('H1')
    expect(wrapper.getByText('Welcome to').parentElement?.className).toMatch('gps-banner__title')
    expect(wrapper.getByText('Welcome to')?.className).toMatch('gps-banner__title')
    expect(wrapper.getByText('My Site')?.className).toMatch('gps-banner__title')
    expect(wrapper.getByText('This is a test site')?.className).toMatch('gps-banner__baseline')
  })
})
