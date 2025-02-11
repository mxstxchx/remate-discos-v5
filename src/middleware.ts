import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

const APP_LOG = '[APP:middleware]'

export async function middleware(req: NextRequest) {
  console.log(`${APP_LOG} Start -----------------`)
  console.log(`${APP_LOG} Path:`, req.nextUrl.pathname)
  
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const path = req.nextUrl.pathname

  const { data: sessions, error } = await supabase
    .from('sessions')
    .select('user_alias, language, welcome_seen')
    .order('last_seen_at', { ascending: false })
    .limit(1)

  if (error) {
    console.error(`${APP_LOG} Session error:`, error)
    return NextResponse.redirect(new URL('/auth', req.url))
  }

  const session = sessions?.[0]
  const isAdmin = session?.user_alias === '_soyelputoamo_'

  console.log(`${APP_LOG} Session:`, session)
  console.log(`${APP_LOG} Is admin:`, isAdmin)

  // No session -> auth
  if (!session?.user_alias && !path.startsWith('/auth')) {
    console.log(`${APP_LOG} No session -> auth`)
    return NextResponse.redirect(new URL('/auth', req.url))
  }

  // Admin enforced path
  if (session?.user_alias && isAdmin && path === '/') {
    console.log(`${APP_LOG} Admin redirect: / -> /admin`)
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  // Regular user welcome flow
  if (session?.user_alias && !path.startsWith('/auth')) {
    if (!session.welcome_seen && path !== '/welcome-back') {
      console.log(`${APP_LOG} Welcome redirect: ${path} -> /welcome-back`)
      return NextResponse.redirect(new URL('/welcome-back', req.url))
    }
  }

  // Protect admin routes
  if (path.startsWith('/admin') && !isAdmin) {
    console.log(`${APP_LOG} Non-admin blocked from /admin`)
    return NextResponse.redirect(new URL('/', req.url))
  }

  console.log(`${APP_LOG} End ------------ Allowing:`, path)
  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|.*\\.png$|favicon.ico).*)',
  ],
}