import createMiddleware from 'next-intl/middleware'
import { NextRequest } from 'next/server'

const intlMiddleware = createMiddleware({
  locales: ['pt', 'en'],
  defaultLocale: 'pt',
  localePrefix: 'always'
})

export default async function middleware(req: NextRequest) {
  return intlMiddleware(req)
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
}
