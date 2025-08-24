"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, Eye, Link as LinkIcon, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

interface FormData {
  id: string
  title: string
  description: string | null
  fields: Array<{
    id: string
    type: string
    label: string
    required: boolean
    placeholder?: string
  }>
}

interface FormPageProps {
  params: Promise<{
    id: string
  }>
}

async function getForm(id: string): Promise<FormData | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/forms/${id}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      return null
    }
    
    return response.json()
  } catch (error) {
    console.error('Error fetching form:', error)
    return null
  }
}

export default function FormPage({ params }: FormPageProps) {
  const [form, setForm] = useState<FormData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [formId, setFormId] = useState<string>('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const loadForm = async () => {
      const resolvedParams = await params
      const id = resolvedParams.id
      setFormId(id)
      
      const formData = await getForm(id)
      if (!formData) {
        notFound()
      }
      setForm(formData)
      setIsLoading(false)
    }

    loadForm()
  }, [params])

  const copyToClipboard = async () => {
    const formUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/respond/${formId}`
    if (typeof window !== "undefined") {
      await navigator.clipboard.writeText(formUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 bg-gradient-to-br from-background via-background to-muted/20 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <Card className="shadow-2xl border-0 bg-background/50 backdrop-blur-sm">
            <CardContent className="pt-12 pb-12">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/20">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Loading Form</h2>
              <p className="text-muted-foreground">Please wait while we load your form...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!form) {
    return null
  }

  const formUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/respond/${formId}`

  return (
    <div className="flex-1 bg-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <Card className="shadow-lg mb-6">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-3xl mb-2">{form.title}</CardTitle>
                {form.description && (
                  <CardDescription className="text-base">
                    {form.description}
                  </CardDescription>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={copyToClipboard}
                  className="px-4 py-2 h-auto flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  {copied ? "Copied!" : "Copy Link"}
                </Button>
                <Link href={`/respond/${formId}`}>
                  <Button className="px-4 py-2 h-auto flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Preview Form
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <LinkIcon className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Form URL</span>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <code className="flex-1 bg-background px-3 py-2 rounded border text-sm font-mono break-all">
                  {formUrl}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="shrink-0 px-3 py-2 h-auto"
                >
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Form Fields</CardTitle>
            <CardDescription>
              These are the fields that will appear in your form
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {form.fields.map((field: FormData['fields'][0]) => (
                <Card key={field.id} className="border-2">
                  <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium">
                          {field.label}
                          {field.required && <span className="text-destructive ml-1">*</span>}
                        </label>
                      </div>
                      <Badge variant="secondary" className="w-fit">
                        {field.type}
                      </Badge>
                    </div>
                    {field.placeholder && (
                      <div className="text-sm text-muted-foreground">
                        Placeholder: &quot;{field.placeholder}&quot;
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Link href={`/responses/${formId}`}>
            <Button variant="outline" size="lg" className="px-6 py-3 h-auto flex items-center gap-2 mx-auto">
              <Eye className="h-4 w-4" />
              View Responses
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
