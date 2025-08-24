import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, FileText, BarChart3, Infinity, Sparkles } from "lucide-react"

export default function Home() {
  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="relative container mx-auto px-6 pt-20 pb-16">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center rounded-full border bg-background/50 px-4 py-2 text-sm font-medium mb-8">
              <Sparkles className="mr-2 h-4 w-4 text-primary" />
              Create forms in seconds, no signup required
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Create Forms in{" "}
              <span className="bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
                Seconds
              </span>
            </h1>
            
            {/* Subheading */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              Askform lets you create beautiful forms and collect responses instantly. 
              No signup required, just create and share your unique link.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/create">
                <Button 
                  size="lg" 
                  className="px-6 py-3 h-auto bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Form
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-6 py-3 h-auto border-2 hover:bg-muted/50 transition-all duration-200 cursor-pointer"
              >
                View Examples
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to create forms
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features to help you build and share forms with ease
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-background/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/20 group-hover:from-blue-500/20 group-hover:to-blue-600/30 transition-all duration-300">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-center">Easy Form Creation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-center leading-relaxed">
                  Intuitive drag and drop interface to create forms with text, email, and textarea fields.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-background/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/20 group-hover:from-emerald-500/20 group-hover:to-emerald-600/30 transition-all duration-300">
                  <BarChart3 className="h-8 w-8 text-emerald-600" />
                </div>
                <CardTitle className="text-xl text-center">Instant Responses</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-center leading-relaxed">
                  Get responses in real-time. Each form gets a unique URL to share with your audience.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-background/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-600/20 group-hover:from-purple-500/20 group-hover:to-purple-600/30 transition-all duration-300">
                  <Infinity className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl text-center">Unlimited Forms</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-center leading-relaxed">
                  Create as many forms as you need. No limits, no restrictions, no hidden fees.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <Card className="max-w-4xl mx-auto border-0 shadow-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
            <CardContent className="pt-16 pb-16 text-center">
              <div className="mb-6">
                <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to get started?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of users creating forms with Askform. Start building your first form in seconds.
              </p>
              <Link href="/create">
                <Button 
                  size="lg" 
                  className="px-8 py-4 h-auto bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Start Creating Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
