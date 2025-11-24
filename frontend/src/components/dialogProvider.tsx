"use client"

import { createContext, useContext, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./shadcn/ui/dialog";

type DialogContextType = {
    openDialog:  (title: string, description: string, node: React.ReactNode) => void;
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

    const openDialog  = (title: string, description: string, node: React.ReactNode) => { setContent(node); setOpen(true); setTitle(title); setDescription(description); }
    const closeDialog = () => setContent(null);

    return (
        <DialogContext.Provider value={{ openDialog, closeDialog }}>
            <div>
                { children }
            </div>
            {
                content && (
                    <div className="fixed inset-0 flex items-center justify-center">
                        <Dialog open={open} onOpenChange={(val) => !val && closeDialog()}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{ title }</DialogTitle>
                                    <DialogDescription>{ description }</DialogDescription>
                                </DialogHeader>
                                
                                { content }
                            </DialogContent>
                        </Dialog>
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