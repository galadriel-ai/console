import {NextResponse} from 'next/server';
import {serialize} from 'cookie';

export async function GET() {
  // Clear the access token by setting a cookie with maxAge 0
  const cookie = serialize("accessToken", '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: "/",
    maxAge: 0, // Immediately expire the cookie
  });

  const response = NextResponse.json({success: true});
  response.headers.set('Set-Cookie', cookie);

  return response;
}
