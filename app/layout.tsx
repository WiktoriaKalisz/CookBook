import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "next-themes"
import { ErrorBoundary } from "./components"

export const metadata: Metadata = {
  title: "CookBook - Recipes",
  description: "Discover and explore delicious recipes",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
  <body className="font-serif antialiased">
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={true}>
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </ThemeProvider>
  </body>
</html>
  )
}
