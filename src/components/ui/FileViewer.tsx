"use client"

import Image from "next/image"
import {
  Download,
  FileSpreadsheet,
  FileText,
  ImageIcon,
  Paperclip,
} from "lucide-react"

export interface AttachedFile {
  url: string
  name: string
  type: string
}

interface FileViewerProps {
  files: AttachedFile[]
  title?: string
}

function guessType(file: AttachedFile): string {
  if (file.type) return file.type
  const ext = file.url?.split("?")[0]?.split(".").pop()?.toLowerCase() ?? ""
  const map: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    pdf: "application/pdf",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    txt: "text/plain",
  }
  return map[ext] ?? ""
}

function FileCard({ file }: { file: AttachedFile }) {
  const type = guessType(file)
  const isImage = type.startsWith("image/")
  const isPdf = type === "application/pdf"
  const isSpreadsheet = type.includes("spreadsheet") || type.includes("xlsx")

  if (isImage) {
    return (
      <div className="border-default bg-surface overflow-hidden rounded-md border">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <Image
          src={file.url}
          alt={file.name}
          width={800}
          height={600}
          unoptimized
          referrerPolicy="no-referrer"
          className="bg-checkerboard max-h-96 w-full object-contain"
          loading="lazy"
        />
        <div className="border-default flex items-center gap-2 border-t px-3 py-2">
          <ImageIcon className="size-3.5 shrink-0 text-blue-500" />
          <span className="text-foreground flex-1 truncate text-xs">
            {file.name}
          </span>
          <a
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            download={file.name}
            className="text-primary shrink-0 text-xs font-bold hover:underline"
          >
            Download
          </a>
        </div>
      </div>
    )
  }

  if (isPdf) {
    return (
      <div className="border-default bg-surface overflow-hidden rounded-md border">
        <div className="border-default flex items-center gap-3 border-b px-4 py-3">
          <FileText className="size-5 shrink-0 text-red-500" />
          <span className="text-foreground flex-1 truncate text-sm font-semibold">
            {file.name}
          </span>
          <a
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold text-red-600 transition-colors hover:bg-red-100"
          >
            <FileText className="size-3.5" /> View PDF
          </a>
        </div>
      </div>
    )
  }

  // Generic doc / download
  const Icon = isSpreadsheet ? FileSpreadsheet : Paperclip
  const iconCls = isSpreadsheet ? "text-green-600" : "text-muted-foreground"

  return (
    <div className="border-default bg-surface flex items-center gap-3 rounded-md border px-4 py-3">
      <Icon className={`size-5 shrink-0 ${iconCls}`} />
      <span className="text-foreground flex-1 truncate text-sm">
        {file.name}
      </span>
      <a
        href={file.url}
        target="_blank"
        rel="noopener noreferrer"
        download={file.name}
        className="bg-primary/10 border-primary/20 text-primary hover:bg-primary inline-flex shrink-0 items-center gap-1.5 rounded-md border px-3 py-1 text-xs font-bold transition-colors hover:text-white"
      >
        <Download className="size-3.5" /> Download
      </a>
    </div>
  )
}

export function FileViewer({ files, title = "Attachments" }: FileViewerProps) {
  if (!files || files.length === 0) return null

  return (
    <div className="space-y-3">
      <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
        {title}
      </p>
      <div className="space-y-3">
        {files.map((f, i) => (
          <FileCard key={i} file={f} />
        ))}
      </div>
    </div>
  )
}
