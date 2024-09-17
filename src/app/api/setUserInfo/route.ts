import {serialize} from "cookie";
import {NextResponse} from "next/server";

export async function POST(req: Request) {
  const {token, username, password} = await req.json();

  const apiResponse = await fetch(`${process.env.BACKEND_API_URL}/auth/set_user_password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      token, username, password
    })
  })

  if (apiResponse.status !== 200) {
    return NextResponse.json({status: apiResponse.status, isSuccess: false});
  }

  const responseJson = await apiResponse.json()
  // Set the access token in an HTTP-only cookie
  const cookie = serialize('accessToken', responseJson.session_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: parseInt(process.env.SESSION_TOKEN_AGE_SECONDS || `${2 * 60 * 60 * 24}`),
    sameSite: 'strict',
    path: '/',
  });

  const response = NextResponse.json({isSuccess: true});
  response.headers.set('Set-Cookie', cookie);

  return response;
}
