import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { responseSchema } from '@/schemas/form'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params
    const body = await request.json()
    const validatedData = responseSchema.parse(body)

    const response = await db.createResponse({
      form_id: resolvedParams.id,
      data: validatedData,
    })

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Error creating response:', error)
    return NextResponse.json(
      { error: 'Failed to create response' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params
    const responses = await db.getResponsesByFormId(resolvedParams.id)
    return NextResponse.json(responses)
  } catch (error) {
    console.error('Error fetching responses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch responses' },
      { status: 500 }
    )
  }
}
