import {NextResponse} from "next/server";

export async function POST(req: Request) {
  const {email, password} = await req.json();
  const expectedPassword = process.env.NODE_ACCESS_PASSWORD
  if (!password || !expectedPassword) {
    return NextResponse.json({isSuccess: false});
  }

  if (password !== expectedPassword) {
    return NextResponse.json({isSuccess: false, error: "invalid_password"});
  }

  const apiResponse = await fetch(`${process.env.BACKEND_API_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email, password
    })
  })
  return NextResponse.json({isSuccess: apiResponse.status === 200});
}
