import {NextResponse} from "next/server";
import {parse} from "cookie";

export async function POST(req: Request) {
  const {data} = await req.json();

  const cookieHeader = req.headers.get('cookie');

  // Parse the cookies
  const cookies = cookieHeader ? parse(cookieHeader) : {};

  // Get the accessToken from cookies
  const token = cookies.accessToken;

  const apiResponse = await fetch(`${process.env.BACKEND_API_URL}/auth/profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      data
    })
  })

  if (apiResponse.status !== 200) {
    return NextResponse.json({status: apiResponse.status, isSuccess: false});
  }
  return NextResponse.json({isSuccess: true});
}
