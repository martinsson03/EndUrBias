"use client"

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { useState, useEffect } from "react";

// Component to toggle website theme.
export default function ThemeToggle() {
    // Get the theme and the function to set the theme.
    const { theme, setTheme } = useTheme();

    // Variable holding the information if this component is mounted yet.
    const [mounted, setMounted] = useState(false);  

    // This will run after the object as mounted, hence the theme will be set by ThemeProvider by then.
    useEffect(() => setMounted(true), []) // Run once, hence [].

    if (!mounted) return null; // Return null if it hasn't mounted yet.

    return (
        <Button onClick={() => { setTheme(theme === "dark" ? "light" : "dark"); console.log(theme); }}>
            { theme === "light" ? <Sun className="w-5 h-5"></Sun> : <Moon className="w-5 h-5"></Moon> }
        </Button>
    );
};