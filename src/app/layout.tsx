import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://quiz-master-nine-flame.vercel.app'),
  title: {
    default: "Smart Mind — PABSON Inter-School Quiz Training 2083",
    template: "%s | Smart Mind PABSON",
  },
  description:
    "Official training and mock competition platform for PABSON Smart Mind Inter-School Quiz Competition 2083. Master timed drills, Spacebar buzzer rounds, and full championship simulations.",
  keywords: [
    "PABSON",
    "Quiz Competition Nepal",
    "Smart Mind 2083",
    "Inter-School Quiz",
    "Buzzer Round",
    "Rapid Fire",
    "Nepal Parichaya",
    "Samanya Gyan",
  ],
  authors: [{ name: "PABSON Central Committee" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://quiz-master-nine-flame.vercel.app",
    siteName: "Smart Mind — PABSON Quiz Training",
    title: "Smart Mind — PABSON Inter-School Quiz Training 2083",
    description:
      "Prepare for the PABSON Inter-School Quiz Championship with interactive timed practice, Rapid Fire, Spacebar Buzzer simulator, and live leaderboards.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Mind — PABSON Inter-School Quiz Training 2083",
    description:
      "Official training platform for PABSON Smart Mind Inter-School Quiz Competition 2083. Try the free demo quiz now!",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Smart Mind Practice",
  },
};

export const viewport: Viewport = {
  themeColor: "#1e3a5f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
