"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download, Calendar, FileText, Loader2 } from "lucide-react"
import Link from "next/link"

interface FormField {
  id: string
  type: string
  label: string
  required: boolean
  placeholder?: string
}

interface FormData {
  id: string
  title: string
  description: string | null
  fields: FormField[]
}

interface ResponseData {
  id: string
  form_id: string
  data: Record<string, string | number>
  created_at: string
}

interface ResponsesPageProps {
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

async function getResponses(formId: string): Promise<ResponseData[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/forms/${formId}/responses`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      return []
    }
    
    return response.json()
  } catch (error) {
    console.error('Error fetching responses:', error)
    return []
  }
}

export default function ResponsesPage({ params }: ResponsesPageProps) {
  const [form, setForm] = useState<FormData | null>(null)
  const [responses, setResponses] = useState<ResponseData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [formId, setFormId] = useState<string>('')

  useEffect(() => {
    const loadData = async () => {
      const resolvedParams = await params
      const id = resolvedParams.id
      setFormId(id)
      
      const [formData, responsesData] = await Promise.all([
        getForm(id),
        getResponses(id)
      ])

      if (!formData) {
        notFound()
      }

      setForm(formData)
      setResponses(responsesData)
      setIsLoading(false)
    }

    loadData()
  }, [params])

  const downloadCSV = () => {
    if (!responses || responses.length === 0 || !form) return

    const headers = form.fields.map((field: FormField) => field.label).join(",")
    const csvData = responses.map((response: ResponseData) => {
      return form.fields
        .map((field: FormField) => {
          const value = response.data[field.id] || ""
          return `"${value}"`
        })
        .join(",")
    })

    const csv = [headers, ...csvData].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${form.title}-responses.csv`
    a.click()
    window.URL.revokeObjectURL(url)
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
              <h2 className="text-2xl font-bold mb-3">Loading Responses</h2>
              <p className="text-muted-foreground">Please wait while we load your form responses...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!form) {
    return null
  }

  return (
    <div className="flex-1 bg-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
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
                <CardTitle className="text-3xl mb-2">Responses</CardTitle>
                <CardDescription className="text-base">{form.title}</CardDescription>
              </div>
              {responses && responses.length > 0 && (
                <Button
                  variant="outline"
                  onClick={downloadCSV}
                  className="px-4 py-2 h-auto flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download CSV
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {responses?.length || 0} responses
              </span>
            </div>
          </CardContent>
        </Card>

        {!responses || responses.length === 0 ? (
          <Card className="shadow-lg">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="text-muted-foreground mb-4">
                <FileText className="mx-auto h-12 w-12" />
              </div>
              <h3 className="text-lg font-medium mb-2">No responses yet</h3>
              <p className="text-muted-foreground mb-6">
                Share your form link to start collecting responses.
              </p>
              <Link href={`/form/${formId}`}>
                <Button className="px-6 py-3 h-auto">View Form</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-lg overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Date
                      </th>
                      {form.fields.map((field: FormField) => (
                        <th
                          key={field.id}
                          className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                        >
                          {field.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {responses.map((response: ResponseData) => (
                      <tr key={response.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                          {new Date(response.created_at).toLocaleDateString()}
                        </td>
                        {form.fields.map((field: FormField) => (
                          <td key={field.id} className="px-6 py-4 whitespace-nowrap text-sm">
                            {response.data[field.id] || "-"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
