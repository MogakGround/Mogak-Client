import { NextRequest, NextResponse } from 'next/server'

const OPENVIDU_URL = process.env.OPENVIDU_SERVER_URL
const OPENVIDU_SECRET = process.env.OPENVIDU_SECRET

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params

    const auth = `Basic ${Buffer.from(`OPENVIDUAPP:${OPENVIDU_SECRET}`).toString('base64')}`

    const response = await fetch(`${OPENVIDU_URL}/api/sessions/${sessionId}/connection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: auth,
      },
    })

    if (!response.ok) {
      const text = await response.text()
      return NextResponse.json(
        { error: `토큰 생성 실패: ${text}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('OpenVidu 토큰 생성 에러:', error)
    return NextResponse.json(
      { error: '서버 에러가 발생했습니다.' },
      { status: 500 }
    )
  }
}

