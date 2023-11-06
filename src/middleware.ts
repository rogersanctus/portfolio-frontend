import { defineMiddleware } from 'astro:middleware'

import { getLanguageByIp } from '@src/lib/i18n'
import { getIp } from '@src/lib/helper'

export const onRequest = defineMiddleware(async (context, next) => {
  const url = context.url
  let lang = url.searchParams.get('lang')
  const ip = getIp(context.request) ?? context.clientAddress

  if (!lang) {
    lang = await getLanguageByIp(ip)
    return context.redirect(`${url.pathname}?lang=${lang}`)
  }

  return next()
})
