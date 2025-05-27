import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import https from 'https'

export async function POST(req: NextRequest) {
  const { sessionId } = await req.json()

  const OPENVIDU_SERVER_URL = process.env.OPENVIDU_SERVER_URL
  const OPENVIDU_SERVER_SECRET = process.env.OPENVIDU_SERVER_SECRET

  const agent = new https.Agent({ rejectUnauthorized: false })

  try {
    const response = await axios.post(
      `${OPENVIDU_SERVER_URL}/api/sessions/${sessionId}/connection`,
      {},
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`).toString('base64')}`,
          'Content-Type': 'application/json',
        },
        httpsAgent: agent,
      }
    )
    return NextResponse.json({ token: response.data.token })
  } catch (error) {
    console.error('OpenVidu token error:', error)
    return NextResponse.json({ error: 'Token creation failed' }, { status: 500 })
  }
}
