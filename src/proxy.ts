import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_ROLES = ['ADMIN', 'SUPERADMIN'];
// Routes that only need a session (any role).
const PROTECTED_ROUTES = ['/dashboard'];

/**
 * Next.js proxy (formerly middleware) for authentication & authorization.
 *
 * 1. Check if the user has a session cookie (access or refresh token)
 * 2. For admin routes, check the role cookie is ADMIN or SUPERADMIN
 * 3. Redirect unauthorized users
 */
export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;
    const userRole = request.cookies.get('userRole')?.value;

    // A session lasts as long as it can still be refreshed. Gating on the access
    // token alone would bounce the user to sign-in the moment it expires, before
    // the axios interceptor ever gets the chance to renew it.
    const hasSession = Boolean(accessToken || refreshToken);
    const isAdmin = ADMIN_ROLES.includes(userRole ?? '');

    // Auth pages: a signed-in user goes to their home.
    if (pathname.startsWith('/auth')) {
        if (hasSession) {
            return NextResponse.redirect(new URL(isAdmin ? '/admin' : '/dashboard', request.url));
        }
        return NextResponse.next();
    }

    if (pathname.startsWith('/admin')) {
        if (!hasSession) return redirectToSignIn(request, pathname);
        if (!isAdmin) return NextResponse.redirect(new URL('/dashboard', request.url));
        return NextResponse.next();
    }

    const isProtectedRoute = PROTECTED_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`),
    );
    if (isProtectedRoute && !hasSession) return redirectToSignIn(request, pathname);

    return NextResponse.next();
}

function redirectToSignIn(request: NextRequest, pathname: string) {
    const loginUrl = new URL('/auth/sign-in', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
}

export const config = {
    matcher: [
        // Everything except Next internals and static files.
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
