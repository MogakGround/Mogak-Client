import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(req: NextRequest) {
  const { sessionId } = await req.json()

  const OPENVIDU_SERVER_URL = process.env.OPENVIDU_SERVER_URL
  const OPENVIDU_SERVER_SECRET = process.env.OPENVIDU_SERVER_SECRET

  try {
    const response = await axios.post(
      `${OPENVIDU_SERVER_URL}/api/sessions`,
      { customSessionId: sessionId },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`).toString('base64')}`,
          'Content-Type': 'application/json',
        },
      }
    )
    return NextResponse.json(response.data)
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 409) {
      // 이미 세션이 존재하는 경우
      return NextResponse.json({ id: sessionId }, { status: 200 })
    }
    return NextResponse.json({ error: 'Session creation failed' }, { status: 500 })
  }
}
