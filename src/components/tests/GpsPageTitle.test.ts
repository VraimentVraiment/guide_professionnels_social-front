// @vitest-environment nuxt

import { mockNuxtImport, renderSuspended } from 'nuxt-vitest/utils'
import { GpsPageTitle } from '#components'

mockNuxtImport('useGetPageContent', () => {
  return () => {
    return {
      getTitle: () => {
        return 'Page title'
      },
    }
  }
})

describe('GpsPageTitle', () => {
  it('renders the page title', async() => {
    const wrapper = await renderSuspended(GpsPageTitle)
    expect(wrapper.getByText('Page title').tagName).toBe('H1')
  })
})
