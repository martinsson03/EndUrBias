import "./globals.css";

import type { Metadata } from "next";

import Header from "@/components/ui/header";
import ThemeProvider from "@/components/theme-provider";

// The metadata will be extracted by the next.js app and be delivered to the user.
export const metadata: Metadata = {
  title: "EYB - End Your Bias",
  description: "HR recruiting tool that censors detials on resumes to keep candidate selection non-biased.",
};

// Layout component that will be applied before the other components.
export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Header></Header>
        </ThemeProvider>
      </body>
    </html>
  );
};