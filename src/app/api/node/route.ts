import {NextRequest, NextResponse} from "next/server";
import {parse} from "cookie";

export async function GET(req: NextRequest) {
  const cookieHeader = req.headers.get('cookie');
  const cookies = cookieHeader ? parse(cookieHeader) : {};
  const token = cookies.accessToken;
  if (!token) {
    return NextResponse.json({error: 'Unauthorized: No token provided'}, {status: 401});
  }

  const apiResponse = await fetch(`${process.env.BACKEND_API_URL}/dashboard/nodes`, {
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
  const {nodeName} = await req.json();

  const cookieHeader = req.headers.get('cookie');

  const cookies = cookieHeader ? parse(cookieHeader) : {};
  const token = cookies.accessToken;
  if (!token) {
    return NextResponse.json({error: 'Unauthorized: No token provided'}, {status: 401});
  }

  const apiResponse = await fetch(`${process.env.BACKEND_API_URL}/dashboard/node`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      node_name: nodeName,
    })
  })
  if (apiResponse.status !== 200) {
    return NextResponse.json({isSuccess: false});
  }

  const responseJson = await apiResponse.json()
  if (responseJson.node_id) {
    return NextResponse.json({
      isSuccess: true,
      nodeId: responseJson.node_id,
    });
  }

  return NextResponse.json({isSuccess: true});
}