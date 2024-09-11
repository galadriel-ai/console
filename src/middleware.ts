import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('accessToken');
  // TODO: check token expiration

  console.log("Middleware token")
  console.log(token)
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

// Apply middleware to certain routes
export const config = {
  // matcher: ['/dashboard/:path*', '/profile/:path*'], // Protect these routes
  // TODO: match only authenticated routes
  matcher: ["/:path*"], // All routes
};
