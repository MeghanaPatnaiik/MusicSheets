"""
api/upload.py — FastAPI router for handling audio & sheet music uploads.
"""

import os
import uuid
import shutil
from pathlib import Path
from typing import List

from fastapi import APIRouter, File, UploadFile, HTTPException, status
from pydantic import BaseModel

router = APIRouter(
    prefix="/upload",
    tags=["Upload"]
)

# Target directory for uploaded audio and PDF files
UPLOAD_DIR = Path(__file__).resolve().parent.parent / "uploads"
ALLOWED_EXTENSIONS = {".mp3", ".wav", ".m4a", ".flac", ".ogg", ".pdf"}
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB limit


class UploadResponse(BaseModel):
  success: bool
  message: str
  filename: str
  original_name: str
  file_size: int
  content_type: str
  file_path: str


def ensure_upload_dir() -> Path:
  """Creates storage directory securely if it doesn't exist."""
  UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
  return UPLOAD_DIR


@router.post("", response_model=UploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_audio_file(file: UploadFile = File(...)):
  """
  Accepts multipart audio or sheet music file upload, validates extension & size,
  saves to local storage, and returns metadata.
  """
  if not file.filename:
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="No file selected or invalid filename.",
    )

  # Check extension
  ext = Path(file.filename).suffix.lower()
  if ext not in ALLOWED_EXTENSIONS:
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=f"Unsupported file extension '{ext}'. Allowed extensions: {', '.join(sorted(ALLOWED_EXTENSIONS))}",
    )

  # Ensure storage directory exists
  target_dir = ensure_upload_dir()

  # Create a unique, sanitized filename to prevent path traversal & collisions
  unique_prefix = uuid.uuid4().hex[:8]
  sanitized_stem = Path(file.filename).stem.replace(" ", "_")
  safe_filename = f"{unique_prefix}_{sanitized_stem}{ext}"
  file_path = target_dir / safe_filename

  # Save uploaded file in chunks
  size_counter = 0
  try:
    with open(file_path, "wb") as buffer:
      while chunk := await file.read(1024 * 1024):  # 1MB chunks
        size_counter += len(chunk)
        if size_counter > MAX_FILE_SIZE:
          # Exceeded size limit — cleanup & raise error
          buffer.close()
          if file_path.exists():
            os.remove(file_path)
          raise HTTPException(
              status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
              detail=f"File size exceeds maximum limit of {MAX_FILE_SIZE // (1024 * 1024)}MB.",
          )
        buffer.write(chunk)
  except HTTPException:
    raise
  except Exception as e:
    if file_path.exists():
      os.remove(file_path)
    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail=f"Failed to save uploaded file: {str(e)}",
    )
  finally:
    await file.close()

  return UploadResponse(
      success=True,
      message="File uploaded successfully",
      filename=safe_filename,
      original_name=file.filename,
      file_size=size_counter,
      content_type=file.content_type or "application/octet-stream",
      file_path=str(file_path),
  )
