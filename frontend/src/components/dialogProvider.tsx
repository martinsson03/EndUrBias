import { createContext, useContext, useState } from "react";
import { Button } from "./shadcn/ui/button";
import { X } from "lucide-react";

type DialogContextType = {
    openDialog:  (node: React.ReactNode) => void;
    closeDialog: () => void;
};

const DialogContext = createContext<DialogContextType | null>(null);

type DialogProviderProps = {
    children: React.ReactNode
};

export default function DialogProvider({ children }: DialogProviderProps) {
    const [content, setContent] = useState<React.ReactNode>(null); // The content of the page.

    const openDialog  = (node: React.ReactNode) => setContent(node);
    const closeDialog = () => setContent(null);

    return (
        <DialogContext.Provider value={{ openDialog, closeDialog }}>
            <div>
                { children }
            </div>
            {
                content && (
                    <div className="fixed inset-0 flex items-center justify-center bg-foreground/50">
                        <Button size="icon" onClick={closeDialog}><X></X></Button>
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