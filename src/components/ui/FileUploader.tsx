"use client"

import { useRef, useState } from "react"
import {
  FileText,
  ImageIcon,
  Paperclip,
  Trash2,
  UploadCloud,
  FileSpreadsheet,
} from "lucide-react"
import RoboLoader from "@/components/loading/robo-loader"
import { studentApi } from "@/lib/api-client"

export interface AttachedFile {
  url: string
  name: string
  type: string
  size?: number
}

interface FileUploaderProps {
  /** Blob path prefix, e.g. "lessons/mod-abc123" */
  folder: string
  /** Current attached files */
  files: AttachedFile[]
  onChange: (files: AttachedFile[]) => void
  multiple?: boolean
  accept?: string
}

const ACCEPTED = ".jpg,.jpeg,.png,.gif,.webp,.pdf,.docx,.pptx,.xlsx,.txt"

function fileIcon(type: string = "") {
  if (type.startsWith("image/"))
    return <ImageIcon className="size-4 shrink-0 text-blue-500" />
  if (type === "application/pdf")
    return <FileText className="size-4 shrink-0 text-red-500" />
  if (type.includes("spreadsheet") || type.includes("xlsx"))
    return <FileSpreadsheet className="size-4 shrink-0 text-green-600" />
  return <Paperclip className="text-muted-foreground size-4 shrink-0" />
}

export function FileUploader({
  folder,
  files,
  onChange,
  multiple = true,
  accept,
}: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [dragging, setDragging] = useState(false)

  async function uploadFiles(fileList: FileList) {
    setError("")
    setUploading(true)
    const newFiles: AttachedFile[] = []
    try {
      for (const file of Array.from(fileList)) {
        const data = await studentApi.uploadFile(folder, file)
        newFiles.push({
          url: data.url,
          name: data.name,
          type: data.type,
          size: data.size,
        })
      }
      onChange([...files, ...newFiles])
    } catch (e: any) {
      setError(e.message)
    } finally {
      setUploading(false)
    }
  }

  function handleRemove(index: number) {
    onChange(files.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files)
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-6 text-center transition-colors ${
          dragging
            ? "border-primary bg-primary/5"
            : "border-default bg-surface hover:border-primary/60 hover:bg-primary/5"
        }`}
      >
        {uploading ? (
          <RoboLoader size="sm" />
        ) : (
          <>
            <UploadCloud className="text-muted-foreground size-7" />
            <p className="text-foreground text-sm font-semibold">
              Drag &amp; drop files, or{" "}
              <span className="text-primary underline">browse</span>
            </p>
            <p className="text-muted-foreground text-[11px]">
              {accept === "image/*"
                ? "Images only (PNG, JPG, WEBP, GIF)"
                : "Images, PDFs, DOCX, PPTX, XLSX, TXT"}
            </p>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept={accept || ACCEPTED}
        className="hidden"
        onChange={(e) => e.target.files && uploadFiles(e.target.files)}
      />

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
          {error}
        </p>
      )}

      {/* File list */}
      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((f, i) => (
            <li
              key={i}
              className="border-default flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm"
            >
              {fileIcon(f.type)}
              <span className="text-foreground flex-1 truncate">{f.name}</span>
              {f.size && (
                <span className="text-muted-foreground shrink-0 text-[11px]">
                  {(f.size / 1024).toFixed(1)} KB
                </span>
              )}
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="text-muted shrink-0 transition-colors hover:text-red-600"
                title="Remove file"
              >
                <Trash2 className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
