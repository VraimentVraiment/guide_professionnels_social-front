import { render } from '@testing-library/vue'

import Apropos from './apropos.vue'

describe('apropos', () => {
  it('should render a simple title', () => {
    const title = 'À propos'

    const { getByText } = render(Apropos)

    const titleEl = getByText(title)

    expect(titleEl).toHaveProperty('tagName', 'H1')
    expect(titleEl).toHaveClass('fr-mt-4w')
  })
})
