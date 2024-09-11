import {serialize} from 'cookie';
import {NextResponse} from "next/server";

export async function POST(req: Request) {
  const {email, password} = await req.json();

  const apiResponse = await fetch(`${process.env.BACKEND_API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email, password
    })
  })
  if (apiResponse.status !== 200) {
    return NextResponse.json({isSuccess: false});
  }

  const responseJson = await apiResponse.json()

  // Set the access token in an HTTP-only cookie
  const cookie = serialize('accessToken', responseJson.session_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 1 day
    sameSite: 'strict',
    path: '/',
  });

  const response = NextResponse.json({isSuccess: true});
  response.headers.set('Set-Cookie', cookie);

  return response;

}
