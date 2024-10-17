import {NextResponse} from "next/server";

export async function POST(req: Request) {
  const {email} = await req.json();

  const apiResponse = await fetch(`${process.env.BACKEND_API_URL}/auth/validate-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email
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

  return NextResponse.json({status: apiResponse.status, isSuccess: apiResponse.status === 200});
}
