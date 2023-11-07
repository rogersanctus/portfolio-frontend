import type { APIContext } from 'astro'

export async function POST({ request, cookies }: APIContext) {
  const reqHeaders = new Headers()
  const cookie = request.headers.get('cookie') ?? ''
  const tokenCookie = cookies.get('signed-token')
  reqHeaders.set('content-type', 'application/json')
  reqHeaders.set('x-csrf-token', tokenCookie?.value ?? '')
  reqHeaders.set('cookie', cookie)

  const data = await request.json()

  try {
    const resp = await fetch('http://localhost:4000/api/contact', {
      credentials: 'include',
      headers: reqHeaders,
      method: 'POST',
      body: JSON.stringify(data)
    })

    if (resp.ok) {
      const respData = await resp.json()

      const response = new Response(JSON.stringify(respData), {
        status: resp.status
      })

      cookies.set('form-success', 'true', {
        path: '/',
        httpOnly: true
      })

      for (const header in cookies.headers()) {
        response.headers.set('set-cookie', header)
      }

      return response
    } else {
      const error = await resp.json()
      console.error('Error response:', error)

      return new Response(JSON.stringify(error), {
        status: resp.status
      })
    }
  } catch (error) {
    return new Response(JSON.stringify(error), {
      status: 500
    })
  }
}
