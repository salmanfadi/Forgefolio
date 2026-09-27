import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import type { ApiResponse } from '@forgefolio/types'

const ContactSchema = z.object({
  message: z.string().min(10).max(500),
  isReferralIntent: z.boolean().default(true),
})

export async function POST(
  req: NextRequest,
  { params }: { params: { learnerId: string } }
) {
  try {
    const json = await req.json()
    const body = ContactSchema.safeParse(json)

    if (!body.success) {
      return NextResponse.json<ApiResponse<null>>(
        { error: { code: 'INVALID_INPUT', message: body.error.message } },
        { status: 400 }
      )
    }

    // 1. Fetch learner email from DB (server-side only, NEVER return to client)
    // 2. Dispatch email via Resend wrapper
    // 3. Log ContactMessage record

    return NextResponse.json<ApiResponse<{ success: boolean }>>({
      data: { success: true },
    })
  } catch {
    return NextResponse.json<ApiResponse<null>>(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to dispatch relay message' } },
      { status: 500 }
    )
  }
}
