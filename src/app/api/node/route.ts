import {NextRequest, NextResponse} from 'next/server';
import {parse} from 'cookie';

export async function GET(req: NextRequest) {
  // Get cookies from the request headers
  const cookieHeader = req.headers.get('cookie');

  // Parse the cookies
  const cookies = cookieHeader ? parse(cookieHeader) : {};

  // Get the accessToken from cookies
  const token = cookies.accessToken;

  if (!token) {
    return NextResponse.json({error: 'Unauthorized: No token provided'}, {status: 401});
  }

  const apiResponse = await fetch(`${process.env.BACKEND_API_URL}/dashboard/node_stats`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  })
  const responseJson = await apiResponse.json()

  // If the token is valid, return the protected data
  return NextResponse.json(responseJson);
}
