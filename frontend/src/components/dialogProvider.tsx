"use client"

import { createContext, useContext, useState } from "react";
import { Card } from "./shadcn/ui/card";
import { Button } from "./shadcn/ui/button";
import { X } from "lucide-react";

type DialogContextType = {
    openDialog:  (title: string, description: string, node: React.ReactNode, width?: string, height?: string) => void;
    closeDialog: () => void;
};

const DialogContext = createContext<DialogContextType | null>(null);

type DialogProviderProps = {
    children: React.ReactNode
};

export default function DialogProvider({ children }: DialogProviderProps) {
    const [content, setContent] = useState<React.ReactNode>(null); // The content of the page.
    const [open, setOpen] = useState(false); // The state of the dialog.
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [width, setWidth] = useState<string | null>(null);
    const [height, setHeight] = useState<string | null>(null);

    const openDialog  = (title: string, description: string, node: React.ReactNode, width?: string, height?: string) => { setContent(node); setOpen(true); setTitle(title); setDescription(description); setWidth(width ?? null); setHeight(height ?? null); }
    const closeDialog = () => setContent(null);

    return (
        <DialogContext.Provider value={{ openDialog, closeDialog }}>
            <div>
                { children }
            </div>
            {
                content && (
                    <div className="fixed inset-0 flex items-center justify-center bg-primary/50" onClick={() => closeDialog()}>
                        <Card className="relative p-5 pt-12 max-w-[90%] max-h-[90%]" style={{ "width": width ?? "inherit", "height": height ?? "inherit" }} onClick={(e) => e.stopPropagation()}>
                            <Button size="icon" variant="outline" className="absolute top-2 right-2" onClick={closeDialog}><X></X></Button>
                            { title && (<h6>{ title }</h6>) }
                            { description && (<p className="text-secondary-foreground">{ description }</p>) }
                            { content }
                        </Card>
                    </div>
                )
            }
        </DialogContext.Provider>
    );
}

// Function for using the dialog.
export function UseDialog() {
    const context = useContext(DialogContext);

    if (!context) throw new Error("UseDialog must be called by a child of <DialogProvider>!");
    
    return context;
}