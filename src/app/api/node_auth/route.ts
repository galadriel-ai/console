import {NextResponse} from "next/server";

export async function POST(req: Request) {
  const {password} = await req.json();
  const expectedPassword = process.env.NODE_ACCESS_PASSWORD
  if (!password || !expectedPassword) {
    return NextResponse.json({isSuccess: false});
  }

  return NextResponse.json({isSuccess: password === expectedPassword});
}