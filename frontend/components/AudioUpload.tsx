"use client";

import React from "react";
import FileDropzone, { FileDropzoneProps } from "./FileDropzone";

export interface AudioUploadProps extends FileDropzoneProps {
  title?: string;
  subtitle?: string;
}

export const AudioUpload: React.FC<AudioUploadProps> = ({
  title = "Upload Audio or Sheet Music",
  subtitle = "Upload your audio recordings or PDF sheets to generate sheet music, MIDI, and interactive piano visualizations.",
  ...dropzoneProps
}) => {
  return (
    <div className="w-full rounded-3xl border border-slate-800 bg-slate-900/60 p-6 md:p-8 backdrop-blur-xl shadow-2xl space-y-6">
      {/* Header section */}
      <div className="space-y-1.5">
        <h2 className="text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 text-base border border-indigo-500/30">
            🎼
          </span>
          {title}
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed">{subtitle}</p>
      </div>

      {/* File Dropzone Component */}
      <FileDropzone {...dropzoneProps} />

      {/* Guidelines & Tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-800/80">
        <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/50">
          <div className="text-indigo-400 text-lg mt-0.5">🎙️</div>
          <div>
            <h4 className="text-xs font-semibold text-slate-200">Clear Recordings</h4>
            <p className="text-xs text-slate-400 mt-0.5">Solo piano acoustic or digital recordings work best for AI transcription.</p>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/50">
          <div className="text-purple-400 text-lg mt-0.5">⚡</div>
          <div>
            <h4 className="text-xs font-semibold text-slate-200">Fast Processing</h4>
            <p className="text-xs text-slate-400 mt-0.5">Files under 10 minutes process in less than 30 seconds.</p>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/50">
          <div className="text-emerald-400 text-lg mt-0.5">📄</div>
          <div>
            <h4 className="text-xs font-semibold text-slate-200">PDF Sheet Import</h4>
            <p className="text-xs text-slate-400 mt-0.5">Import scanned PDF sheet music to generate MIDI & keynotes.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioUpload;
