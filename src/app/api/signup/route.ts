import {NextResponse} from "next/server";
import {serialize} from "cookie";

export async function POST(req: Request) {
  const {email, password, isReset} = await req.json();

  const apiResponse = await fetch(`${process.env.BACKEND_API_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password,
      is_existing_user: isReset,
    })
  })
  if (apiResponse.status !== 200) {
    try {
      const responseJson = await apiResponse.json()
      return NextResponse.json({status: apiResponse.status, isSuccess: false, ...responseJson});
    } catch (e) {
      console.log(e)
    }
    return NextResponse.json({status: apiResponse.status, isSuccess: false});
  }

  const responseJson = await apiResponse.json()

  // Set the access token in an HTTP-only cookie
  const cookie = serialize("accessToken", responseJson.session_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: parseInt(process.env.SESSION_TOKEN_AGE_SECONDS || `${2 * 60 * 60 * 24}`),
    sameSite: "strict",
    path: "/",
  });

  const response = NextResponse.json({
    isSuccess: true,
    userId: responseJson.user_uid,
    email: responseJson.email,
  });
  response.headers.set("Set-Cookie", cookie);

  return response;
}
