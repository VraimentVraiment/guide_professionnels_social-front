import type { DirectusUser } from 'nuxt-directus/dist/runtime/types'

export async function useUpdateDirectusSelfUser(
  url: string,
  token: string,
  payload: Partial<DirectusUser>,
) {
  try {
    const response = await fetch(`${url}/users/me?access_token=${token}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }

    return response.json()
  } catch (e) {
    warn(e as string)
  }
}
