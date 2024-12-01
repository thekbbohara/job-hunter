import { ThemeProvider } from "@/components/theme-provider"
import type {Metadata} from 'next';
import "./globals.css"

export const metadata:Metadata = {
  title:'Job-hunter',
  description:"An automated job application platform that matches job seekers with relevant listings and automatically applies on their behalf. Employers can post jobs, view filtered applications, and receive personalized candidate profiles, streamlining the recruitment process by reducing manual effort and improving candidate selection efficiency.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="bg-red-500">
      <body>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
        {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
