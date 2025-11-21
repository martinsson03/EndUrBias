"use client";
// Detta är en klientkomponent eftersom den använder state, drag-events och File API.

import { useRef, useState, DragEvent, ChangeEvent } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CvDropzoneProps = {
  // Callback som skickar upp filen till föräldrakomponenten (ApplyFormClient)
  onFileChange?: (file: File | null) => void;
};

export function CvDropzone({ onFileChange }: CvDropzoneProps) {
  // Håller den uppladdade PDF-filen
  const [file, setFile] = useState<File | null>(null);

  // Visuellt state för drag-and-drop
  const [isDragging, setIsDragging] = useState(false);

  // Ref för att programatiskt öppna file picker
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Max 10 MB för PDF
  const MAX_SIZE = 10 * 1024 * 1024;

  // Öppnar file-dialogen när man klickar på dropzone
  const openFileDialog = () => {
    inputRef.current?.click();
  };

  // Markerar dropzone när man drar en fil över den
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  // Tar bort highlight när musen lämnar området
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  // När en fil släpps i dropzone
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (!droppedFile) return;

    // Endast PDF tillåts
    if (droppedFile.type !== "application/pdf") return;

    // Maxstorlek 10 MB
    if (droppedFile.size > MAX_SIZE) return;

    // Spara fil och bubbla upp till parent
    setFile(droppedFile);
    onFileChange?.(droppedFile);
  };

  // När en fil väljs via file picker
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;

    // PDF-validering
    if (selected && selected.type !== "application/pdf") {
      e.target.value = "";
      return;
    }

    // Maxstorlek
    if (selected && selected.size > MAX_SIZE) {
      e.target.value = "";
      return;
    }

    // Spara fil och bubbla upp
    setFile(selected);
    onFileChange?.(selected);

    // Gör det möjligt att ladda upp samma fil igen
    e.target.value = "";
  };

  // Tar bort vald fil
  const handleRemove = () => {
    setFile(null);
    onFileChange?.(null);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Upload CV (PDF, max 10MB)</label>

      {/* Själva dropzonen */}
      <div
        className={cn(
          "border-2 border-dashed rounded-xl px-6 py-8 flex flex-col items-center justify-center text-center gap-3 bg-muted/30 transition-colors cursor-pointer",
          isDragging && "border-primary bg-primary/10" // highlight vid drag
        )}
        onClick={openFileDialog}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="w-6 h-6 opacity-70" />

        <div>
          <p className="text-sm font-medium">Drag & drop your CV here</p>
          <p className="text-xs text-muted-foreground">
            Only PDF files, max 10 MB
          </p>
        </div>

        {/* Knapp för att öppna file dialog */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation(); // förhindrar att klick bubblar till dropzone
            openFileDialog();
          }}
        >
          Browse files
        </Button>

        {/* Osynlig file input — öppnas via ref */}
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Visar vald fil */}
      {file && (
        <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2 text-sm">
          <div className="flex flex-col">
            <span className="font-medium">{file.name}</span>
            <span className="text-xs text-muted-foreground">
              {(file.size / 1024).toFixed(1)} kB
            </span>
          </div>

          {/* Ta bort filen */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleRemove}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
