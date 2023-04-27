import { render } from '@testing-library/vue'

import Login from './apropos.vue'

describe('login', () => {
  it('should render two inputs and a button', () => {
    const { getByText } = render(Login)

    const titleEl = getByText('Connexion')

    expect(titleEl).toHaveProperty('tagName', 'H1')
    expect(titleEl).toHaveClass('fr-mt-4w')
  })
})
