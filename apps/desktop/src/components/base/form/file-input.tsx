import React, { useState, useRef } from "react";
import { Upload, X, FileText, Image as ImageIcon } from "lucide-react";
import { cn } from "@/src/utils";
import { Input } from "./input";

interface FileInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  variant?: "field" | "dropzone" | "field-2";
  dropzoneVariant?: "rectangle" | "square" | "narrow";
  maxFileSize?: number; // In MB
}





export const FileInput = ({
  label,
  error,
  variant = "dropzone",
  dropzoneVariant = "rectangle",
  maxFileSize,
  className,
  onChange,
  accept,
  ...props
}: FileInputProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [internalError, setInternalError] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    const selectedFile = files?.[0];
    setInternalError(undefined);

    if (selectedFile) {
      if (maxFileSize && selectedFile.size > maxFileSize * 1024 * 1024) {
        setInternalError(`File size exceeds ${maxFileSize}MB limit`);
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    onChange?.(e);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    const files: File[] = [];
    
    for (let i = 0; i < items.length; i++) {
      if (items[i].kind === "file") {
        const file = items[i].getAsFile();
        if (file) files.push(file);
      }
    }

    if (files.length > 0) {
      handleFiles(files as unknown as FileList);
    }
  };

  const handleClear = (e: React.MouseEvent) => {

    e.stopPropagation();
    setFile(null);
    setInternalError(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const displayError = error || internalError;

  const triggerInput = () => {
    fileInputRef.current?.click();
  };

  const inputId = React.useId();

  if (variant === "field" || variant === "field-2") {
    return (
      <div 
        className="flex flex-col w-full gap-1.5 outline-none" 
        onPaste={handlePaste}
        tabIndex={0}
        onKeyDown={(e) => {
          if ((e.key === "Delete" || e.key === "Backspace") && file) {
            e.preventDefault();
            handleClear(e as unknown as React.MouseEvent);
          } else if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            triggerInput();
          }
        }}
      >
        <input
          {...props}
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleFileChange}
        />
        
        {variant === "field" ? (
          <Input
            label={label}
            error={displayError}
            readOnly
            placeholder={props.placeholder || "Click to upload file..."}
            value={file ? file.name : ""}
            onClick={triggerInput}
            leftIcon={<Upload size={18} />}
            rightIcon={
              file && (
                <button onClick={handleClear} className="hover:text-red-500 transition-colors">
                  <X size={16} />
                </button>
              )
            }
            className={cn("cursor-pointer", className)}
          />
        ) : (
          <div className="flex flex-col gap-1.5">
            {label && (
              <label className="text-sm font-medium text-black dark:text-white ml-1">
                {label}
                {props.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
              <div 
                className={cn(
                  "flex items-center w-full h-10 rounded-xl border bg-black overflow-hidden transition-all duration-200 focus-within:ring-2 focus-within:ring-sky-500/20 focus-within:border-sky-500",
                  displayError ? "border-red-500" : "border-gray-800",
                  className
                )}
              >
              <div 
                onClick={triggerInput}
                className="flex-1 h-full flex items-center px-3 cursor-pointer truncate text-sm text-white"
              >
                {file ? (
                  <span className="truncate">{file.name}</span>
                ) : (
                  <span className="text-gray-400">{props.placeholder || "No file selected"}</span>
                )}
              </div>
              
              <div className="flex items-center h-full">
                {file && (
                  <button 
                    onClick={handleClear} 
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors mr-1 cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                )}

                <button
                  type="button"
                  onClick={triggerInput}
                  className="h-full px-4 flex items-center text-xs font-medium bg-white text-black hover:bg-gray-200 transition-colors border-l border-gray-800"
                >
                  {file ? "Replace" : "Select a File"}
                </button>
              </div>
            </div>
            {displayError && <span className="text-xs text-red-500 ml-1 font-medium">{displayError}</span>}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-1.5">
      {label && (
        <label className="text-sm font-medium text-white ml-1">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div
        onClick={triggerInput}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onPaste={handlePaste}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            triggerInput();
          } else if ((e.key === "Delete" || e.key === "Backspace") && file) {
            e.preventDefault();
            handleClear(e as unknown as React.MouseEvent);
          }
        }}

        className={cn(
          "group relative flex flex-col items-center justify-center w-full p-4 rounded-2xl border transition-all cursor-pointer outline-none focus-within:ring-2 focus-within:ring-sky-500/20 focus-within:border-sky-500",
          "bg-black hover:bg-gray-900/50",
          file ? "border-sky-500 bg-sky-500/10" : "border-gray-800 border-dashed hover:border-sky-500",
          isDragging && "border-sky-500 bg-sky-900/20",
          displayError && "border-red-500 bg-red-500/10",
          // Shape variants
          dropzoneVariant === "rectangle" && "min-h-[120px]",
          dropzoneVariant === "square" && "aspect-square",
          dropzoneVariant === "narrow" && "min-h-[48px] p-2",
          className
        )}


      >
        <input
          {...props}
          ref={fileInputRef}
          type="file"
          id={inputId}
          accept={accept}
          className="hidden"
          onChange={handleFileChange}
        />

        {file ? (
          <div className={cn(
            "flex items-center w-full gap-4",
            dropzoneVariant === "square" && "flex-col justify-center text-center gap-2",
            dropzoneVariant === "narrow" && "gap-2"
          )}>
            <div className={cn(
              "rounded-xl bg-gray-800 flex items-center justify-center text-sky-500 shadow-sm border border-gray-700 shrink-0",
              dropzoneVariant === "narrow" ? "w-8 h-8" : "w-12 h-12"
            )}>
              {file.type.startsWith("image/") ? (
                <ImageIcon size={dropzoneVariant === "narrow" ? 16 : 24} />
              ) : (
                <FileText size={dropzoneVariant === "narrow" ? 16 : 24} />
              )}
            </div>

            
            <div className={cn(
              "flex flex-col flex-1 min-w-0",
              dropzoneVariant === "square" ? "w-full px-2 items-center" : "items-start"
            )}>
              <span className={cn(
                "text-sm font-medium text-white truncate block w-full",
                dropzoneVariant === "square" ? "text-center" : "text-left"
              )}>
                {file.name}
              </span>


              <span className="text-xs text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>

            <button
              type="button"
              onClick={handleClear}
              className="p-2 rounded-full bg-gray-800 hover:bg-red-500 hover:text-white transition-all shadow-sm cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className={cn(
            "flex items-center gap-2 pointer-events-none transition-all",
            dropzoneVariant === "narrow" ? "flex-row w-full" : "flex-col"
          )}>
            <div className={cn(
              "rounded-full bg-sky-500/10 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform shrink-0",
              dropzoneVariant === "narrow" ? "w-8 h-8" : "w-10 h-10"
            )}>
              <Upload size={dropzoneVariant === "narrow" ? 16 : 20} />
            </div>
            <div className={cn(
              "flex flex-col min-w-0",
              dropzoneVariant === "narrow" ? "items-start" : "items-center"
            )}>

              <span className="text-sm font-medium text-white">
                {isDragging ? "Drop your file here" : "Click or drag to upload"}
              </span>
              <span className="text-xs text-gray-500">
                {accept ? `Supports: ${accept}` : "All file types supported"}
              </span>
            </div>
          </div>
        )}
      </div>

      {displayError && (
        <span className="text-xs text-red-500 ml-1 font-medium">{displayError}</span>
      )}
    </div>
  );
};


