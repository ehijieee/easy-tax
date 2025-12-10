import createMiddleware from 'next-intl/middleware'
import type { NextRequest } from 'next/server'
import { updateSession } from './lib/supabase/middleware'

const intlMiddleware = createMiddleware({
  locales: ['en', 'pidgin'],
  defaultLocale: 'en'
})

export async function middleware(request: NextRequest) {
  const authResponse = await updateSession(request)
  if (authResponse.redirected) return authResponse

  const i18nResponse = intlMiddleware(request)

  // propagate cookies set by authResponse to i18nResponse
  authResponse.cookies.getAll().forEach((cookie) => {
    i18nResponse.cookies.set(cookie)
  })

  return i18nResponse
}

export const config = {
  matcher: [
    '/',
    '/(en|pidgin)/:path*',
    '/dashboard/:path*',
    '/admin/:path*',
    '/auth/:path*'
  ]
}
