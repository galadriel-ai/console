import {NextRequest, NextResponse} from "next/server";
import {parse} from "cookie";

export async function GET(req: NextRequest) {
  const cookieHeader = req.headers.get('cookie');
  const cookies = cookieHeader ? parse(cookieHeader) : {};
  const token = cookies.accessToken;
  if (!token) {
    return NextResponse.json({error: 'Unauthorized: No token provided'}, {status: 401});
  }

  const apiResponse = await fetch(`${process.env.BACKEND_API_URL}/dashboard/api-key`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  })
  const responseJson = await apiResponse.json()
  return NextResponse.json(responseJson);
}

export async function POST(req: Request) {
  const cookieHeader = req.headers.get('cookie');

  const cookies = cookieHeader ? parse(cookieHeader) : {};
  const token = cookies.accessToken;
  if (!token) {
    return NextResponse.json({error: 'Unauthorized: No token provided'}, {status: 401});
  }

  const apiResponse = await fetch(`${process.env.BACKEND_API_URL}/dashboard/api-key`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  })
  if (apiResponse.status !== 200) {
    return NextResponse.json({isSuccess: false});
  }

  const responseJson = await apiResponse.json()
  if (responseJson.api_key && responseJson.created_at) {
    return NextResponse.json({
      isSuccess: true,
      apiKey: responseJson.api_key,
      createdAt: responseJson.created_at,
    });
  }

  // TODO:
  return NextResponse.json({isSuccess: true});
}