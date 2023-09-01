describe('Accessing the nuxt instance', () => {
  it('have access to app config', () => {
    expect(useAppConfig()).toBeTruthy()
  })

  it('have access to runtime config', () => {
    expect(useRuntimeConfig().public.directus).toBeTruthy()
  })

  it('have access to runtime directus config', () => {
    expect(useRuntimeConfig().public.directus).toBeTruthy()
  })

  it('have access to pinia instance', () => {
    expect(usePinia()).toBeTruthy()
  })
})
