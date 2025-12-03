"use client"

import Header from "@/components/page/app/ui/header";
import ThemeProvider from "@/components/themeProvider";
import DialogProvider from "../dialogProvider";

export default function AppLayout({children}: Readonly<{children: React.ReactNode;}>) {
    return(
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <DialogProvider>
                <Header></Header>
                { children }
            </DialogProvider>
        </ThemeProvider>
    );
}