import {NextRequest, NextResponse} from "next/server";
import {parse} from "cookie";

export async function POST(req: NextRequest) {
  const {graphType, nodeName} = await req.json();

  const cookieHeader = req.headers.get('cookie');
  const cookies = cookieHeader ? parse(cookieHeader) : {};
  const token = cookies.accessToken;
  if (!token) {
    return NextResponse.json({error: 'Unauthorized: No token provided'}, {status: 401});
  }

  let apiUrl = `${process.env.BACKEND_API_URL}/dashboard/graph?graph_type=${graphType}`
  if (nodeName) {
    apiUrl += `&node_name=${nodeName}`
  }
  const apiResponse = await fetch(apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  })
  const responseJson = await apiResponse.json()
  return NextResponse.json(responseJson);
}