import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken");
  // Optimistic approach, if cookie is still present assume it's OK
  // Browser automatically deletes expired cookies
  if (!token && req.nextUrl.pathname !== "/login") {
    // If no session token, redirect to login page
    // return NextResponse.redirect("/login");
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Optional: verify the token server-side if necessary
  // If token is valid, let the request continue
  return NextResponse.next();
}

export const config = {
  // matcher: ['/dashboard/:path*', '/profile/:path*'], // Protect these routes
  // Excludes /api and static files from middleware, and whitelisted pages that dont require to be logged in
  // https://stackoverflow.com/questions/76348460/nextjs-13-4-app-router-middleware-page-redirect-has-no-styles
  // Exclude all static files etc, just |route_name to exclude some page
  matcher: ['/((?!api|_next/static|_next/image|favicon.png|authenticate|reset|img).*)']
}