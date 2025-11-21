import Header from "@/components/page/app/ui/header";
import ThemeProvider from "@/components/themeProvider";

export default function AppLayout({children}: Readonly<{children: React.ReactNode;}>) {
    return(
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <Header></Header>
            { children }
        </ThemeProvider>
    );
}