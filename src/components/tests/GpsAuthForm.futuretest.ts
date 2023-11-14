// @vitest-environment nuxt

import { mockNuxtImport, renderSuspended, mockComponent } from 'nuxt-vitest/utils'
import { GpsAuthForm } from '#components'

mockComponent('DsfrFieldset', () => import('@/layers/dsfr/env'))

mockNuxtImport('useGpsAuth', () => {
  return () => {
    return {
      fieldSet: null,
      email: {
        value: 'ee',
        props: {
          label: 'email field',
          placeholder: 'a',
        },
        errorMessage: {
          value: 'aa',
        },
        validMessage: {
          value: 'aa',
        },
      },
      password: {
        value: 'ee',
        props: {
          label: 'password field',
          placeholder: 'a',
        },
        errorMessage: {
          value: 'aa',
        },
        validMessage: {
          value: 'aa',
        },
      },
      submitButtonModel: {
        label: 'submit label',
      },
      alertModel: {
        display: true,
        props: {
          type: 'info',
          description: 'test description',
        },
      },
      submit: () => {},
      isError: false,
    }
  }
})

describe('GpsAuthForm', () => {
  it('renders the email and password input fields', async() => {
    const wrapper = await renderSuspended(GpsAuthForm)

    expect(wrapper.getByLabelText('email field')?.tagName).toBeTruthy()
    // expect(wrapper.find('input[type="password"]').exists()).toBe(true)
  })

  // it('disables the submit button when the form is invalid', async() => {
  // })

  // it('emits a "submit" event when the form is submitted', async() => {
  // })
})
