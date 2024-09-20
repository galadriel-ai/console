import {NextResponse} from "next/server";

export async function POST(req: Request) {
  const {email} = await req.json();

  const apiResponse = await fetch(`${process.env.BACKEND_API_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email
    })
  })
  return NextResponse.json({isSuccess: apiResponse.status === 200});
}
