"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import useAudioUpload from "@/hooks/useAudioUpload";

export default function UploadPage() {
  const {
    file,
    status,      // "idle" | "selected" | "uploading" | "success" | "error"
    progress,
    error,
    result,
    selectFile,
    removeFile,
    uploadFile,
    reset,
  } = useAudioUpload();

  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    selectFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (status === "idle") setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleStartUpload = async () => {
    await uploadFile();
  };

  // Map hook status + local drag state onto the visual states main's design expects
  const visualState = isDragging
    ? "dragging"
    : status === "success"
    ? "done"
    : status; // "idle" | "selected" | "uploading" | "error"

  return (
    <AppShell>
      <div className="page-content">
        <div>
          <h1 className="page-title">Upload Audio</h1>
          <p className="page-sub">
            Drop a piano recording to transcribe it into sheet music, MIDI, and visual keynotes.
          </p>
        </div>

        {/* Error banner */}
        {status === "error" && error && (
          <div className="error-banner glass-card">
            <span className="error-icon" aria-hidden="true">⚠️</span>
            <div className="error-text">
              <p className="error-title">Upload encountered an error</p>
              <p className="error-sub">{error}</p>
            </div>
            <button type="button" className="error-dismiss" onClick={reset}>
              Dismiss
            </button>
          </div>
        )}

        {/* Drop zone */}
        {visualState !== "done" && (
          <div
            className={`drop-zone glass-card${
              visualState === "dragging" ? " drop-zone--active" : ""
            }${
              visualState === "selected" || visualState === "uploading"
                ? " drop-zone--selected"
                : ""
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => status === "idle" && inputRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label="Drop audio file or click to browse"
            onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".mp3,.wav,.m4a,.flac,.ogg"
              className="drop-input"
              aria-label="Select audio file"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />

            {visualState === "idle" || visualState === "dragging" ? (
              <>
                <div className="drop-icon" aria-hidden="true">
                  {visualState === "dragging" ? "📂" : "🎵"}
                </div>
                <p className="drop-title">
                  {visualState === "dragging" ? "Release to upload" : "Drop your audio file here"}
                </p>
                <p className="drop-sub">
                  or <span className="drop-browse">click to browse</span>
                </p>
                <p className="drop-formats">Supports MP3, WAV, M4A, FLAC, OGG</p>
              </>
            ) : visualState === "selected" ? (
              <>
                <div className="drop-icon" aria-hidden="true">🎧</div>
                <p className="drop-title">{file?.name}</p>
                <p className="drop-sub">Ready to transcribe</p>
                <div className="selected-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    id="upload-transcribe-btn"
                    type="button"
                    className="btn-primary upload-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartUpload();
                    }}
                  >
                    Start Transcription
                  </button>
                </div>
              </>
            ) : visualState === "error" ? (
              <>
                <div className="drop-icon" aria-hidden="true">🎵</div>
                <p className="drop-title">Drop your audio file here</p>
                <p className="drop-sub">
                  or <span className="drop-browse">click to browse</span>
                </p>
                <p className="drop-formats">Supports MP3, WAV, M4A, FLAC, OGG</p>
              </>
            ) : (
              <>
                <div className="drop-icon upload-spin" aria-hidden="true">⚙️</div>
                <p className="drop-title">Transcribing…</p>
                <p className="drop-sub">This usually takes 15–60 seconds</p>
                <div className="upload-progress">
                  <div
                    className="upload-progress-bar"
                    style={{ width: `${progress ?? 0}%` }}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* Done state */}
        {visualState === "done" && (
          <div className="done-card glass-card">
            <span className="done-icon" aria-hidden="true">✅</span>
            <h2 className="done-title">Transcription complete!</h2>
            <p className="done-sub">
              {result?.original_name ? `${result.original_name} is ready. ` : ""}
              View it in My Sheet Music.
            </p>
            <div className="done-actions">
              <Link href="/my-sheets" className="btn-primary done-btn">
                View Sheet Music
              </Link>
              <button type="button" className="done-reset" onClick={reset}>
                Upload another
              </button>
            </div>
          </div>
        )}

        {/* Format info cards */}
        <div className="format-grid">
          {[
            { icon: "🎼", title: "Sheet Music", desc: "Full MusicXML + PDF export, editable in MuseScore or Sibelius." },
            { icon: "🎹", title: "MIDI Export", desc: "Standard MIDI file for DAWs, sequencers, and digital instruments." },
            { icon: "🖼️", title: "Visual Keynotes", desc: "Animated piano roll visualization, perfect for learning and sharing." },
          ].map((f) => (
            <div key={f.title} className="format-card glass-card">
              <span className="format-icon" aria-hidden="true">{f.icon}</span>
              <div>
                <p className="format-title">{f.title}</p>
                <p className="format-desc">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .page-content { display: flex; flex-direction: column; gap: 1.75rem; }
        .page-title {
          margin: 0;
          font-size: clamp(1.4rem, 2.5vw, 1.875rem);
          font-weight: 800;
          letter-spacing: -0.04em;
          color: var(--text-primary);
        }
        .page-sub {
          margin: 0.25rem 0 0;
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        /* ── Error banner ── */
        .error-banner {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          border: 1px solid rgba(244, 63, 94, 0.3);
          background: rgba(244, 63, 94, 0.08);
        }
        .error-icon { font-size: 1.25rem; line-height: 1.2; }
        .error-text { flex: 1; }
        .error-title {
          margin: 0;
          font-size: 0.875rem;
          font-weight: 700;
          color: #fda4af;
        }
        .error-sub {
          margin: 0.15rem 0 0;
          font-size: 0.8rem;
          color: rgba(253, 164, 175, 0.8);
        }
        .error-dismiss {
          background: none;
          border: none;
          color: #fda4af;
          font-size: 0.75rem;
          text-decoration: underline;
          cursor: pointer;
        }

        /* ── Drop zone ── */
        .drop-zone {
          min-height: 280px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.625rem;
          text-align: center;
          padding: 3rem 2rem;
          cursor: pointer;
          border: 2px dashed var(--glass-border);
          background: var(--glass-bg);
          border-radius: 1.25rem;
          transition: border-color 0.2s var(--ease-default),
                      background 0.2s var(--ease-default);
        }
        .drop-zone--active {
          border-color: var(--accent-from);
          background: rgba(99, 102, 241, 0.07);
        }
        .drop-zone--selected {
          cursor: default;
        }
        .drop-input { display: none; }

        .drop-icon { font-size: 3rem; line-height: 1; }
        .drop-title {
          margin: 0;
          font-size: 1.0625rem;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.02em;
        }
        .drop-sub {
          margin: 0;
          font-size: 0.875rem;
          color: var(--text-muted);
        }
        .drop-browse {
          color: var(--accent-from);
          font-weight: 600;
          text-decoration: underline;
          cursor: pointer;
        }
        .drop-formats {
          margin: 0;
          font-size: 0.75rem;
          color: var(--text-subtle);
        }
        .selected-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }
        .upload-btn {
          width: auto;
          padding: 0.6rem 1.5rem;
          font-size: 0.9rem;
        }
        .btn-secondary {
          width: auto;
          padding: 0.6rem 1.25rem;
          font-size: 0.875rem;
          border-radius: 0.75rem;
          border: 1px solid var(--glass-border);
          background: none;
          color: var(--text-muted);
          cursor: pointer;
          transition: color 0.18s, border-color 0.18s;
        }
        .btn-secondary:hover { color: var(--text-primary); border-color: rgba(255,255,255,0.2); }

        /* Progress bar */
        .upload-progress {
          width: 200px;
          height: 4px;
          border-radius: 9999px;
          background: var(--glass-border);
          overflow: hidden;
          margin-top: 0.5rem;
        }
        .upload-progress-bar {
          height: 100%;
          border-radius: 9999px;
          background: linear-gradient(90deg, var(--accent-from), var(--accent-to));
          transition: width 0.3s var(--ease-default);
        }
        .upload-spin { animation: spin-anim 1s linear infinite; display: inline-block; }
        @keyframes spin-anim {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        /* ── Done card ── */
        .done-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.625rem;
          padding: 3rem 2rem;
          text-align: center;
        }
        .done-icon { font-size: 3rem; line-height: 1; }
        .done-title {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .done-sub {
          margin: 0;
          font-size: 0.9rem;
          color: var(--text-muted);
        }
        .done-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: 0.5rem;
          flex-wrap: wrap;
          justify-content: center;
        }
        .done-btn {
          width: auto;
          padding: 0.6rem 1.5rem;
          font-size: 0.9rem;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
        }
        .done-reset {
          background: none;
          border: 1px solid var(--glass-border);
          border-radius: 0.75rem;
          padding: 0.6rem 1.25rem;
          color: var(--text-muted);
          font-size: 0.875rem;
          cursor: pointer;
          transition: color 0.18s, border-color 0.18s;
        }
        .done-reset:hover { color: var(--text-primary); border-color: rgba(255,255,255,0.2); }

        /* ── Format cards ── */
        .format-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }
        @media (max-width: 700px) {
          .format-grid { grid-template-columns: 1fr; }
        }
        .format-card {
          display: flex;
          align-items: flex-start;
          gap: 0.875rem;
          padding: 1.125rem 1rem;
        }
        .format-icon { font-size: 1.5rem; line-height: 1; flex-shrink: 0; }
        .format-title {
          margin: 0 0 0.25rem;
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .format-desc {
          margin: 0;
          font-size: 0.8rem;
          color: var(--text-muted);
          line-height: 1.5;
        }
      `}</style>
    </AppShell>
  );
}