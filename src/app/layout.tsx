import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Askform",
  description: "Askform is a platform for creating and sharing forms.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container mx-auto px-6 flex h-16 items-center justify-between">
                <div className="flex items-center">
                  <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
                      <span className="text-primary-foreground font-bold text-sm">A</span>
                    </div>
                    <span className="font-bold text-xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      Askform
                    </span>
                  </Link>
                </div>
                
                <div className="flex items-center space-x-4">
                  <nav className="hidden md:flex items-center space-x-6">
                    <Link
                      href="/create"
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Create Form
                    </Link>
                  </nav>
                  <ModeToggle />
                </div>
              </div>
            </header>
            
            {/* Main Content */}
            <div className="flex-1">
              {children}
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
