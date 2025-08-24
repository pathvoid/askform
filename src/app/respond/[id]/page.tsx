"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { responseSchema, type ResponseData } from "@/schemas/form"
import { CheckCircle, ArrowLeft, Loader2, Sparkles } from "lucide-react"
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

interface RespondPageProps {
  params: Promise<{
    id: string
  }>
}

export default function RespondPage({ params }: RespondPageProps) {
  const [form, setForm] = useState<FormData | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [formId, setFormId] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResponseData>({
    resolver: zodResolver(responseSchema),
  })

  useEffect(() => {
    const loadForm = async () => {
      const resolvedParams = await params
      const id = resolvedParams.id
      setFormId(id)
      
      try {
        const response = await fetch(`/api/forms/${id}`)
        
        if (!response.ok) {
          console.error("Error fetching form:", response.statusText)
          return
        }

        const data = await response.json()
        setForm(data)
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadForm()
  }, [params])

  const onSubmit = async (data: ResponseData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/forms/${formId}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to submit response')
      }

      setIsSubmitted(true)
    } catch (error) {
      console.error("Error submitting response:", error)
      alert("Failed to submit response. Please try again.")
    } finally {
      setIsSubmitting(false)
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
    return (
      <div className="flex-1 bg-gradient-to-br from-background via-background to-muted/20 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <Card className="shadow-2xl border-0 bg-background/50 backdrop-blur-sm">
            <CardContent className="pt-12 pb-12">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-destructive/10 to-destructive/20">
                <Sparkles className="h-8 w-8 text-destructive" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Form Not Found</h2>
              <p className="text-muted-foreground mb-8">The form you&apos;re looking for doesn&apos;t exist or has been removed.</p>
              <Link href="/">
                <Button className="px-6 py-3 h-auto bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200">
                  Go Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="flex-1 bg-gradient-to-br from-background via-background to-muted/20 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <Card className="shadow-2xl border-0 bg-background/50 backdrop-blur-sm">
            <CardContent className="pt-12 pb-12">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500/10 to-green-600/20">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Response Submitted!</h2>
              <p className="text-muted-foreground mb-8">Thank you for your response. Your submission has been received successfully.</p>
              <Link href="/">
                <Button className="px-6 py-3 h-auto bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200">
                  Go Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const renderField = (field: {
    id: string
    type: string
    label: string
    required: boolean
    placeholder?: string
  }) => {
    const fieldName = field.id
    const isRequired = field.required

    switch (field.type) {
      case "textarea":
        return (
          <Textarea
            {...register(fieldName, { required: isRequired })}
            placeholder={field.placeholder}
            className={errors[fieldName] ? "border-destructive" : ""}
            rows={4}
          />
        )
      case "email":
        return (
          <Input
            type="email"
            {...register(fieldName, { 
              required: isRequired,
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })}
            placeholder={field.placeholder}
            className={errors[fieldName] ? "border-destructive" : ""}
          />
        )
      case "number":
        return (
          <Input
            type="number"
            {...register(fieldName, { required: isRequired })}
            placeholder={field.placeholder}
            className={errors[fieldName] ? "border-destructive" : ""}
          />
        )
      default:
        return (
          <Input
            type="text"
            {...register(fieldName, { required: isRequired })}
            placeholder={field.placeholder}
            className={errors[fieldName] ? "border-destructive" : ""}
          />
        )
    }
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-background via-background to-muted/20 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </div>

        <Card className="shadow-2xl border-0 bg-background/50 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl mb-2">{form.title}</CardTitle>
            {form.description && (
              <CardDescription className="text-base">
                {form.description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {form.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.id} className="text-base font-medium">
                    {field.label}
                    {field.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  {renderField(field)}
                  {errors[field.id] && (
                    <p className="text-sm text-destructive">
                      {String(errors[field.id]?.message) || "This field is required"}
                    </p>
                  )}
                </div>
              ))}

              <div className="flex justify-end pt-6 border-t border-muted/50">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="lg"
                  className="px-8 py-4 h-auto bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isSubmitting ? "Submitting..." : "Submit Response"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
