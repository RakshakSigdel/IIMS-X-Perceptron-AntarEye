import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { PAGE_ROUTES, UserRole, TABLES } from './src/lib/constants';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  
  // Public routes
  if (path === PAGE_ROUTES.PUBLIC.HOME || path === PAGE_ROUTES.PUBLIC.LOGIN) {
    if (user) {
      // If logged in, redirect based on role (we need profile to know role)
      const { data: profile } = await supabase.from(TABLES.USER_PROFILES).select('role').eq('auth_user_id', user.id).single();
      if (profile?.role === UserRole.ADMIN) {
        return NextResponse.redirect(new URL(PAGE_ROUTES.ADMIN.DASHBOARD, request.url));
      }
      if (profile?.role === UserRole.DOCTOR) {
        return NextResponse.redirect(new URL(PAGE_ROUTES.DOCTOR.DASHBOARD, request.url));
      }
      // If role is unknown or missing, let them stay on login to re-authenticate or see an error
    }
    return response;
  }

  // Protected routes require authentication
  if (!user) {
    return NextResponse.redirect(new URL(PAGE_ROUTES.PUBLIC.LOGIN, request.url));
  }

  // Role-based routing
  const { data: profile } = await supabase.from(TABLES.USER_PROFILES).select('role').eq('auth_user_id', user.id).single();

  if (!profile) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  if (path.startsWith('/admin')) {
    if (profile.role !== UserRole.ADMIN) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  if (path.startsWith('/doctor')) {
    if (profile.role !== UserRole.DOCTOR) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return response;
}
