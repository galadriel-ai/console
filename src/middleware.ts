import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('accessToken');
  // Optimistic approach, if cookie is still present assume it's OK
  // Browser automatically deletes expired cookies
  if (!token) {
    // If no session token, redirect to login page
    return NextResponse.redirect(new URL('/login', req.url));
  }
  if (req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Optional: verify the token server-side if necessary
  // If token is valid, let the request continue
  return NextResponse.next();
}

export const config = {
  // matcher: ['/dashboard/:path*', '/profile/:path*'], // Protect these routes
  // TODO: match only authenticated routes
  matcher: ["/:path*"], // All routes
};
