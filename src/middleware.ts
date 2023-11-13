import { defineMiddleware } from 'astro:middleware'

import { getLanguageByIp } from '@src/lib/i18n'
import { getIp } from '@src/lib/helper'

export const onRequest = defineMiddleware(async (context, next) => {
  const url = context.url

  console.log('middleware', url.pathname)
  if (url.pathname.startsWith('/api/')) {
    return next()
  }

  let lang = url.searchParams.get('lang')
  const ip = getIp(context.request) ?? context.clientAddress

  if (!lang) {
    lang = await getLanguageByIp(ip)
    url.searchParams.set('lang', lang)
    return context.redirect(`${url.pathname}${url.search}`)
  }

  return next()
})
