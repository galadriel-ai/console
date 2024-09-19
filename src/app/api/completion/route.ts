import {createOpenAI} from '@ai-sdk/openai';
import {parse} from "cookie";
import {NextResponse} from "next/server";
import {streamText} from "ai";


export const runtime = "edge"

export async function POST(req: Request) {
  const cookieHeader = req.headers.get('cookie');
  const cookies = cookieHeader ? parse(cookieHeader) : {};
  const token = cookies.accessToken;
  if (!token) {
    return NextResponse.json({error: 'Unauthorized: No token provided'}, {status: 401});
  }

  const openai = createOpenAI({
    apiKey: token,
    baseURL: process.env.BACKEND_API_URL + "/dashboard",
    compatibility: "compatible",
  })

  const json = await req.json()
  const {prompt} = json

  const result = await streamText({
    model: openai.languageModel(process.env.MODEL_ID || ""),
    system: "You are a helpful assistant",
    prompt
  })
  return result.toDataStreamResponse()
}