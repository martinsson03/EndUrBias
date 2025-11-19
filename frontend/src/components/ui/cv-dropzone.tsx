"use client";

import { useRef, useState, DragEvent, ChangeEvent } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CvDropzoneProps = {
  onFileChange?: (file: File | null) => void;
};

export function CvDropzone({ onFileChange }: CvDropzoneProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (!droppedFile) return;

    // ❗ Only PDF
    if (droppedFile.type !== "application/pdf") return;

    // ❗ Max 10 MB
    if (droppedFile.size > MAX_SIZE) return;

    setFile(droppedFile);
    onFileChange?.(droppedFile);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;

    // ❗ Only PDF
    if (selected && selected.type !== "application/pdf") {
      e.target.value = "";
      return;
    }

    // ❗ Max 10 MB
    if (selected && selected.size > MAX_SIZE) {
      e.target.value = "";
      return;
    }

    setFile(selected);
    onFileChange?.(selected);
    e.target.value = "";
  };

  const handleRemove = () => {
    setFile(null);
    onFileChange?.(null);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Upload CV (PDF, max 10MB)</label>

      <div
        className={cn(
          "border-2 border-dashed rounded-xl px-6 py-8 flex flex-col items-center justify-center text-center gap-3 bg-muted/30 transition-colors cursor-pointer",
          isDragging && "border-primary bg-primary/10"
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

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            openFileDialog();
          }}
        >
          Browse files
        </Button>

        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {file && (
        <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2 text-sm">
          <div className="flex flex-col">
            <span className="font-medium">{file.name}</span>
            <span className="text-xs text-muted-foreground">
              {(file.size / 1024).toFixed(1)} kB
            </span>
          </div>
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
