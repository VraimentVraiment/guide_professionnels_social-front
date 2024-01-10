// @vitest-environment nuxt

import { renderSuspended } from '@nuxt/test-utils/runtime'
import { expect, it, describe } from 'vitest'
import { GpsSiteBanner } from '#components'

describe('GpsSiteBanner', () => {
  it('renders the title and baseline text', async() => {
    const wrapper = await renderSuspended(GpsSiteBanner)
    expect(wrapper.getByText('Guide des').parentElement?.tagName).toBe('H1')
    expect(wrapper.getByText('Guide des').parentElement?.className).toMatch('gps-banner__title')
    expect(wrapper.getByText('Guide des')?.className).toMatch('gps-banner__title')
    expect(wrapper.getByText('dans le département du Calvados')?.className).toMatch('gps-banner__baseline')
  })
})
