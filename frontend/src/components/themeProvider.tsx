"use client"
 
import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

/* 
  The theme provider can toggle the class name dark or nothing on the html document which
  overrides the :root css variables with dark mode css variabels. Hence changing the theme.
*/
export default function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}