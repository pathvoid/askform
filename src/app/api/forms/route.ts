import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createFormSchema } from '@/schemas/form'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createFormSchema.parse(body)

    const form = await db.createForm({
      title: validatedData.title,
      description: validatedData.description || null,
      fields: validatedData.fields,
    })

    return NextResponse.json(form, { status: 201 })
  } catch (error) {
    console.error('Error creating form:', error)
    return NextResponse.json(
      { error: 'Failed to create form' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const forms = await db.getAllForms()
    return NextResponse.json(forms)
  } catch (error) {
    console.error('Error fetching forms:', error)
    return NextResponse.json(
      { error: 'Failed to fetch forms' },
      { status: 500 }
    )
  }
}
