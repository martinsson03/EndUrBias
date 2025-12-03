"use client"

import { Input } from "@/components/shadcn/ui/input";
import { useState } from "react";
import { Search } from "lucide-react";

// Search bar used for searching new jobs.
export default function SearchBar() {
    const [query, setQuery] = useState("");

    return (
        <div className="relative">
            <Input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search for a job..." className="pr-12 pl-6 rounded-full text-secondary-foreground"></Input>
            <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-secondary-foreground"></Search>
        </div>
    );
}