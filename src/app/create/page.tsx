"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createFormSchema } from "@/schemas/form"
import { Plus, Trash2, ArrowLeft, FileText } from "lucide-react"
import Link from "next/link"

export default function CreateForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      title: "",
      description: "",
      fields: [
        {
          id: crypto.randomUUID(),
          type: "text",
          label: "",
          required: false,
          placeholder: "",
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
  })

  const addField = () => {
    append({
      id: crypto.randomUUID(),
      type: "text",
      label: "",
      required: false,
      placeholder: "",
    })
  }

  const onSubmit = async (data: {
    title: string
    description: string
    fields: Array<{
      id: string
      type: string
      label: string
      required: boolean
      placeholder: string
    }>
  }) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to create form')
      }

      const form = await response.json()
      router.push(`/form/${form.id}`)
    } catch (error) {
      console.error("Error creating form:", error)
      alert("Failed to create form. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-background via-background to-muted/20 min-h-screen">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </div>

        {/* Main Form Card */}
        <Card className="shadow-2xl border-0 bg-background/50 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/20">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-4xl font-bold">Create Your Form</CardTitle>
            <CardDescription className="text-lg max-w-2xl mx-auto">
              Build a custom form with multiple field types. Add as many fields as you need to collect the information you want.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              {/* Form Details */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-base font-semibold">
                    Form Title *
                  </Label>
                  <Input
                    id="title"
                    {...register("title")}
                    placeholder="Enter a descriptive title for your form"
                    className={`h-12 text-base ${errors.title ? "border-destructive" : ""}`}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-base font-semibold">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Provide a brief description of what this form is for (optional)"
                    rows={4}
                    className="text-base resize-none"
                  />
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Form Fields</h2>
                    <p className="text-muted-foreground mt-1">
                      Add the fields that will appear in your form
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={addField}
                    className="px-6 py-3 h-auto border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Field
                  </Button>
                </div>

                <div className="space-y-6">
                  {fields.map((field, index) => (
                    <Card key={field.id} className="border-2 border-muted/50 hover:border-primary/20 transition-all duration-300 group">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-lg font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                            Field {index + 1}
                          </h3>
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => remove(index)}
                              className="px-3 py-2 h-auto text-destructive hover:text-destructive border-destructive/20 hover:border-destructive hover:bg-destructive/10 transition-all duration-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                          <div className="space-y-2">
                            <Label htmlFor={`field-type-${index}`} className="text-sm font-semibold">
                              Field Type
                            </Label>
                            <Select
                              value={watch(`fields.${index}.type`)}
                              onValueChange={(value) => setValue(`fields.${index}.type`, value)}
                            >
                              <SelectTrigger className="h-11">
                                <SelectValue placeholder="Select field type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">Text</SelectItem>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="textarea">Textarea</SelectItem>
                                <SelectItem value="number">Number</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-semibold">Required</Label>
                            <div className="flex items-center space-x-3 pt-2">
                              <Checkbox
                                id={`required-${index}`}
                                checked={watch(`fields.${index}.required`)}
                                onCheckedChange={(checked) => setValue(`fields.${index}.required`, Boolean(checked))}
                              />
                              <Label htmlFor={`required-${index}`} className="text-sm cursor-pointer">
                                This field is required
                              </Label>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div className="space-y-2">
                            <Label htmlFor={`field-label-${index}`} className="text-sm font-semibold">
                              Field Label *
                            </Label>
                            <Input
                              id={`field-label-${index}`}
                              {...register(`fields.${index}.label`)}
                              placeholder="Enter a clear label for this field"
                              className={`h-11 text-base ${
                                errors.fields?.[index]?.label ? "border-destructive" : ""
                              }`}
                            />
                            {errors.fields?.[index]?.label && (
                              <p className="text-sm text-destructive">
                                {errors.fields[index]?.label?.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`field-placeholder-${index}`} className="text-sm font-semibold">
                              Placeholder Text
                            </Label>
                            <Input
                              id={`field-placeholder-${index}`}
                              {...register(`fields.${index}.placeholder`)}
                              placeholder="Enter placeholder text to guide users (optional)"
                              className="h-11 text-base"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {errors.fields && (
                  <p className="text-sm text-destructive">{errors.fields.message}</p>
                )}
              </div>

              <div className="flex justify-end pt-8 border-t border-muted/50">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="lg"
                  className="px-8 py-4 h-auto bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isSubmitting ? "Creating..." : "Create Form"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
