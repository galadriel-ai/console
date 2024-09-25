import {NextRequest, NextResponse} from "next/server";
import {parse} from "cookie";

export async function POST(req: NextRequest) {
  const {graphType} = await req.json();

  const cookieHeader = req.headers.get('cookie');
  const cookies = cookieHeader ? parse(cookieHeader) : {};
  const token = cookies.accessToken;
  if (!token) {
    return NextResponse.json({error: 'Unauthorized: No token provided'}, {status: 401});
  }

  const apiResponse = await fetch(`${process.env.BACKEND_API_URL}/dashboard/graph?graph_type=${graphType}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  })
  const responseJson = await apiResponse.json()
  return NextResponse.json(responseJson);
}