"use client";

import { useRef, useState, DragEvent, ChangeEvent } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/shadcn/ui/button";
import { cn } from "@/lib/shadcn/utils";

type CvDropzoneProps = {
  onFileChange: (file: File | null) => void,
  id?: string,
  className?: string
};

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB upload size.

export function CvDropzone({ onFileChange, id, className }: CvDropzoneProps) {
    const [file, setFile] = useState<File | null>(null); // The CV file.

    const [isDragging, setIsDragging] = useState(false); // If is dragging over the box.

    // File explorer input in case of no drag and drop.
    const inputRef = useRef<HTMLInputElement | null>(null);

    // Opens the hidden file dialog.
    const openFileDialog = () => {
        inputRef.current?.click();
    };

    // Mark the dropzone when dragging something over.
    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    // Set isDragging to false when leaving drop area.
    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    // Handle when the file is dropped.
    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files?.[0];

        if(!droppedFile || !checkIfFileIsValid(droppedFile)) return;

        setFile(droppedFile);
        onFileChange?.(droppedFile);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0] ?? null;

        if(!selected || !checkIfFileIsValid(selected)) { e.target.value = ""; return; }

        // If everything is ok, set the file.
        setFile(selected);
        onFileChange(selected);

        // Make it possible to upload a new file.
        e.target.value = "";
    };

    const handleRemove = () => {
        setFile(null);
        onFileChange(null);
    };

    return (
        <div className="flex flex-col gap-2">
            <div className={cn("border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer", isDragging && "bg-secondary" )}
                onClick={openFileDialog}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}>

                <Upload className="w-6 h-6 opacity-70" />

                <p className="text-secondary-foreground">Drag & drop your CV here</p>

                <Button variant="outline" onClick={(e) => { e.stopPropagation(); openFileDialog(); }}>Browse files</Button>

                <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={handleFileChange}/>
            </div>

            {file && (
                <div className="flex items-center justify-between rounded-xl border p-3">
                    <div className="flex flex-col">
                        <span>{file.name}</span>
                        <span className="text-secondary-foreground">{(file.size / 1024).toFixed(1)} kB</span>
                    </div>

                    <Button variant="ghost" size="icon" onClick={handleRemove}>
                        <X></X>
                    </Button>
                </div>
            )}
        </div>
    );
}

function checkIfFileIsValid(file: File): boolean {
    // Check file type.
    if (file && file.type !== "application/pdf") return false;

    // Check size.
    if (file && file.size > MAX_SIZE) return false;

    return true;
}