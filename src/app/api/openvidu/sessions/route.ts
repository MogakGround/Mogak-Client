import { NextRequest, NextResponse } from 'next/server'

const OPENVIDU_URL = process.env.OPENVIDU_SERVER_URL
const OPENVIDU_SECRET = process.env.OPENVIDU_SECRET

export async function POST(request: NextRequest) {
  if (!OPENVIDU_URL) {
    console.error('OPENVIDU_URL이 설정되지 않았습니다.')
    return NextResponse.json({ error: 'OpenVidu 서버 URL이 설정되지 않았습니다.' }, { status: 500 })
  }

  try {
    const body = await request.json()
    const { customSessionId } = body
    console.log('customSessionId:', customSessionId)

    const auth = `Basic ${Buffer.from(`OPENVIDUAPP:${OPENVIDU_SECRET}`).toString('base64')}`
    const targetUrl = `${OPENVIDU_URL}/api/sessions`

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: auth,
      },
      body: JSON.stringify({ customSessionId }),
    })

    console.log('OpenVidu 응답 상태:', response.status)

    // 409는 세션이 이미 존재하는 경우 - 정상적인 케이스
    if (response.status === 409) {
      return NextResponse.json({ id: customSessionId }, { status: 200 })
    }

    if (!response.ok) {
      const text = await response.text()
      console.error('OpenVidu 에러 응답:', text)
      return NextResponse.json({ error: `세션 생성 실패: ${text}` }, { status: response.status })
    }

    const data = await response.json()
    console.log('세션 생성 성공:', data)
    return NextResponse.json(data)
  } catch (error) {
    console.error('OpenVidu 세션 생성 에러:', error)
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 에러'
    return NextResponse.json({ error: `서버 에러: ${errorMessage}` }, { status: 500 })
  }
}
