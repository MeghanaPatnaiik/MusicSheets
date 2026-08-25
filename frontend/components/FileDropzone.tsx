"use client";

import React, { useState, useRef, ChangeEvent, DragEvent, KeyboardEvent } from "react";

export interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  selectedFile?: File | null;
  onRemoveFile?: () => void;
  isUploading?: boolean;
  progress?: number;
  acceptedTypes?: string[];
  maxSizeBytes?: number; // e.g. 50MB default
}

const DEFAULT_ACCEPTED = [
  "audio/mpeg",
  "audio/wav",
  "audio/x-m4a",
  "audio/mp4",
  "audio/flac",
  "audio/ogg",
  "application/pdf",
];

const DEFAULT_EXTENSIONS = ".mp3,.wav,.m4a,.flac,.ogg,.pdf";

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFileSelect,
  selectedFile = null,
  onRemoveFile,
  isUploading = false,
  progress = 0,
  acceptedTypes = DEFAULT_ACCEPTED,
  maxSizeBytes = 50 * 1024 * 1024, // 50MB
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    setError(null);

    // Size check
    if (file.size > maxSizeBytes) {
      const sizeMB = (maxSizeBytes / (1024 * 1024)).toFixed(0);
      setError(`File size exceeds limit of ${sizeMB}MB.`);
      return false;
    }

    // Type check (mime type or extension fallback)
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    const allowedExts = DEFAULT_EXTENSIONS.split(",");
    const isValidMime = acceptedTypes.some((type) => file.type.includes(type.split("/")[1] || ""));
    const isValidExt = allowedExts.includes(ext);

    if (!isValidMime && !isValidExt) {
      setError("Unsupported file format. Please upload an audio file (MP3, WAV, M4A, FLAC, OGG) or Sheet Music (PDF).");
      return false;
    }

    return true;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (validateFile(file)) {
      onFileSelect(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isUploading) {
      setIsDragging(true);
    }
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

    if (isUploading) return;
    handleFiles(e.dataTransfer.files);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleClick = () => {
    if (!selectedFile && !isUploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if ((e.key === "Enter" || e.key === " ") && !selectedFile && !isUploading) {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const isPdf = selectedFile?.name.toLowerCase().endsWith(".pdf");

  return (
    <div className="w-full">
      <div
        role="button"
        tabIndex={selectedFile || isUploading ? -1 : 0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative w-full rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${isDragging
            ? "border-indigo-400 bg-indigo-500/10 shadow-lg shadow-indigo-500/10 scale-[1.01]"
            : selectedFile
              ? "border-indigo-500/40 bg-slate-900/60"
              : "border-slate-700/80 bg-slate-900/40 hover:border-indigo-500/50 hover:bg-slate-900/60 cursor-pointer"
          }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={DEFAULT_EXTENSIONS}
          onChange={handleInputChange}
          className="hidden"
          aria-label="Upload Audio or Sheet Music File"
        />

        {!selectedFile && !isUploading ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-inner">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
              </svg>
            </div>
            <div>
              <p className="text-base font-semibold text-slate-100">
                {isDragging ? "Drop your file here" : "Drag & drop audio or sheet music here"}
              </p>
              <p className="mt-1 text-sm text-slate-400">
                or <span className="font-medium text-indigo-400 underline underline-offset-2">browse computer</span>
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <span className="rounded-full bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-400 border border-slate-700/50">
                MP3, WAV, M4A, FLAC, OGG
              </span>
              <span className="rounded-full bg-indigo-950/60 px-2.5 py-1 text-xs font-medium text-indigo-300 border border-indigo-800/40">
                PDF Sheet Music
              </span>
              <span className="rounded-full bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-400 border border-slate-700/50">
                Max 50MB
              </span>
            </div>
          </div>
        ) : isUploading ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-4">
            <div className="relative flex h-16 w-16 items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
              <span className="text-xs font-bold text-indigo-400">{progress}%</span>
            </div>
            <div>
              <p className="text-base font-semibold text-slate-100">Uploading File...</p>
              <p className="mt-0.5 text-xs text-slate-400">{selectedFile?.name}</p>
            </div>
            <div className="w-full max-w-xs bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {isPdf ? (
                  <svg className="h-6 w-6 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                )}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-100 truncate max-w-xs">{selectedFile.name}</p>
                <p className="text-xs text-slate-400">
                  {formatFileSize(selectedFile.size)} • {isPdf ? "PDF Document" : "Audio File"}
                </p>
              </div>
            </div>
            {onRemoveFile && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFile();
                }}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
                title="Remove file"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 flex items-center space-x-2 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-300">
          <svg className="h-4 w-4 shrink-0 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FileDropzone;
