"use client"

import Image from "next/image"
import {
  ExternalLink,
  FileText,
  Link2,
  Layers,
  CheckSquare,
} from "lucide-react"
import type { LessonSection } from "@/types"
import { useState } from "react"

function preprocessHtml(html: string): string {
  return html
}

// function getYouTubeId(url: string): string | null {
//   const regexes = [
//     /youtube\.com\/watch\?v=([^&]+)/,
//     /youtu\.be\/([^?&]+)/,
//     /youtube\.com\/embed\/([^?&]+)/,
//   ];
//   for (const re of regexes) {
//     const match = url.match(re);
//     if (match) return match[1];
//   }
//   return null;
// }

// function getVimeoId(url: string): string | null {
//   const match = url.match(/vimeo\.com\/(\d+)/);
//   return match ? match[1] : null;
// }

// function VideoRenderer({ url, title }: { url: string; title?: string }) {
//   const ytId = getYouTubeId(url);
//   const vimeoId = getVimeoId(url);

//   if (ytId) {
//     return (
//       <div className="space-y-2 w-full">
//         {title && (
//           <h3 className="font-semibold text-foreground text-sm">{title}</h3>
//         )}
//         <div
//           className="relative overflow-hidden rounded-sm border border-default shadow-xs"
//           style={{ paddingBottom: "56.25%" }}
//         >
//           <iframe
//             src={`https://www.youtube.com/embed/${ytId}`}
//             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//             allowFullScreen
//             className="absolute inset-0 size-full"
//             title={title ?? "Video"}
//           />
//         </div>
//       </div>
//     );
//   }

//   if (vimeoId) {
//     return (
//       <div className="space-y-2 w-full">
//         {title && (
//           <h3 className="font-semibold text-foreground text-sm">{title}</h3>
//         )}
//         <div
//           className="relative overflow-hidden rounded-sm border border-default shadow-xs"
//           style={{ paddingBottom: "56.25%" }}
//         >
//           <iframe
//             src={`https://player.vimeo.com/video/${vimeoId}`}
//             allow="autoplay; fullscreen; picture-in-picture"
//             allowFullScreen
//             className="absolute inset-0 size-full"
//             title={title ?? "Video"}
//           />
//         </div>
//       </div>
//     );
//   }

//   // Direct video file
//   return (
//     <div className="space-y-2 w-full">
//       {title && (
//         <h3 className="font-semibold text-foreground text-sm">{title}</h3>
//       )}
//       <video
//         controls
//         className="w-full rounded-sm border border-default shadow-xs"
//         src={url}
//       >
//         Your browser does not support the video tag.
//       </video>
//     </div>
//   );
// }

function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

function getVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  return match ? match[1] : null
}

function PlayButton() {
  return (
    <div
      style={{
        width: 56,
        height: 56,
        borderRadius: "50%",
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
        transition: "background 0.18s, transform 0.18s",
        cursor: "pointer",
      }}
      className="play-btn-circle"
    >
      {/* Triangle play icon */}
      <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ marginLeft: 3 }}
      >
        <polygon points="5,3 19,11 5,19" fill="white" />
      </svg>
    </div>
  )
}

function YouTubePlayer({ ytId, title }: { ytId: string; title?: string }) {
  const [playing, setPlaying] = useState(false)
  const thumbnail = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`

  return (
    <div className="w-full space-y-2">
      {title && (
        <h3 className="text-foreground text-sm font-semibold">{title}</h3>
      )}
      <div
        className="border-default relative overflow-hidden rounded-sm border shadow-xs"
        style={{ paddingBottom: "56.25%" }}
      >
        {!playing ? (
          <button
            onClick={() => setPlaying(true)}
            aria-label={`Play ${title ?? "video"}`}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              padding: 0,
              border: "none",
              background: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Thumbnail */}
            <Image
              src={thumbnail}
              alt={title ?? "Video thumbnail"}
              fill
              className="object-cover"
            />
            {/* Dark overlay on hover */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.15)",
                transition: "background 0.18s",
              }}
              className="thumbnail-overlay"
            />
            {/* Custom play button */}
            <div style={{ position: "relative", zIndex: 2 }}>
              <PlayButton />
            </div>
          </button>
        ) : (
          <iframe
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 size-full"
            title={title ?? "Video"}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
            }}
          />
        )}
      </div>
      <style>{`
        button:hover .play-btn-circle {
          background: rgba(0,0,0,0.92) !important;
          transform: scale(1.08);
        }
        button:hover .thumbnail-overlay {
          background: rgba(0,0,0,0.28) !important;
        }
      `}</style>
    </div>
  )
}

function VideoRenderer({ url, title }: { url: string; title?: string }) {
  const ytId = getYouTubeId(url)
  const vimeoId = getVimeoId(url)

  if (ytId) {
    return <YouTubePlayer ytId={ytId} title={title} />
  }

  if (vimeoId) {
    return (
      <div className="w-full space-y-2">
        {title && (
          <h3 className="text-foreground text-sm font-semibold">{title}</h3>
        )}
        <div
          className="border-default relative overflow-hidden rounded-sm border shadow-xs"
          style={{ paddingBottom: "56.25%" }}
        >
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}`}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 size-full"
            title={title ?? "Video"}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      </div>
    )
  }

  // Direct video file
  return (
    <div className="w-full space-y-2">
      {title && (
        <h3 className="text-foreground text-sm font-semibold">{title}</h3>
      )}
      <video
        controls
        className="border-default w-full rounded-sm border shadow-xs"
        src={url}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  )
}

export default VideoRenderer

export function SectionBlock({ section }: { section: LessonSection }) {
  // Helpers to get align classes
  const getAlignClass = (
    align: "left" | "center" | "right" | undefined,
    isText = false
  ) => {
    if (align === "left") return isText ? "text-left" : "mr-auto ml-0"
    if (align === "right") return isText ? "text-right" : "ml-auto mr-0"
    if (align === "center") return isText ? "text-center" : "mx-auto"
    return isText ? "text-left" : "mx-auto" // Defaults
  }

  const getFlexAlign = (align: "left" | "center" | "right" | undefined) => {
    if (align === "left") return "justify-start"
    if (align === "right") return "justify-end"
    if (align === "center") return "justify-center"
    return "justify-start"
  }

  const getFlexItemAlign = (align: "left" | "center" | "right" | undefined) => {
    if (align === "left") return "items-start"
    if (align === "right") return "items-end"
    if (align === "center") return "items-center"
    return "items-center"
  }

  const getPaddingClass = (
    paddingX: "none" | "sm" | "md" | "lg" | "xl" | undefined,
    isPdf = false
  ) => {
    if (!paddingX) return isPdf ? "px-3" : "px-3"
    if (paddingX === "none") return "px-0"
    if (paddingX === "sm") return "px-3 sm:px-4"
    if (paddingX === "md") return "px-5 sm:px-8"
    if (paddingX === "lg") return "px-8 sm:px-12"
    if (paddingX === "xl") return "px-10 sm:px-16 lg:px-24"
    return isPdf ? "px-3" : "px-5"
  }

  switch (section.type) {
    case "rich_text":
      return (
        <div
          className={`pt-1 pb-1 ${getPaddingClass(section.paddingX)} ${getAlignClass(section.align, true)}`}
        >
          <div
            className="rich-content text-foreground/80 text-[14px] block w-full text-left leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: preprocessHtml(section.content),
            }}
          />
        </div>
      )

    case "image": {
      const sizeMap = {
        sm: "w-[30%] min-w-[240px]",
        md: "w-[50%] min-w-[320px]",
        lg: "w-[75%] min-w-[480px]",
        full: "w-full",
      }
      const currentSizeCls = sizeMap[section.size || "full"] || "w-full"

      return (
        <figure
          className={`py-1 flex flex-col ${getPaddingClass(section.paddingX)} ${getFlexItemAlign(section.align)}`}
        >
          {section.url ? (
            <Image
              src={section.url}
              alt={section.caption ?? "Lesson image"}
              width={1200}
              height={800}
              className={`${currentSizeCls} ${getAlignClass(section.align)} border-default bg-checkerboard max-h-[75vh] rounded-sm border object-contain`}
              loading="lazy"
            />
          ) : (
            <div
              className={`bg-subtle border-default text-muted flex h-32 items-center justify-center rounded-sm border border-dashed text-xs ${currentSizeCls}`}
            >
              Image section
            </div>
          )}
          {section.caption && (
            <figcaption
              className={`text-muted mt-2 w-full text-xs italic ${currentSizeCls} ${getAlignClass(section.captionAlign || section.align, true)}`}
            >
              {section.caption}
            </figcaption>
          )}
        </figure>
      )
    }

    case "video": {
      const sizeMap = {
        sm: "w-[40%] min-w-[140px]",
        md: "w-[60%] min-w-[200px]",
        lg: "w-[80%] min-w-[260px]",
        full: "w-full",
      }
      const currentSizeCls =
        sizeMap[((section as any).size as keyof typeof sizeMap) || "lg"] ||
        "w-[80%] min-w-[600px]" // lg is default
      return (
        <div
          className={`flex py-2 ${getPaddingClass(section.paddingX)} ${getFlexAlign(section.align)}`}
        >
          <div className={`${currentSizeCls} ${getAlignClass(section.align)}`}>
            <VideoRenderer url={section.url} title={section.title} />
          </div>
        </div>
      )
    }

    case "pdf":
      return (
        <div
          className={`flex py-2 ${getPaddingClass(section.paddingX, true)} ${getFlexAlign(section.align)}`}
        >
          <div className="border-default bg-surface flex w-full max-w-[260px] items-center gap-2 rounded-sm border px-3 py-2 shadow-xs">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-sm border border-red-100 bg-red-50">
              <FileText className="size-4 text-red-500" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-foreground truncate text-sm font-medium">
                {section.filename || "Document"}
              </p>

              <p className="text-muted text-[9px] font-semibold tracking-wide uppercase">
                PDF
              </p>
            </div>

            <a
              href={section.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1 rounded-sm border border-red-200 bg-red-50 px-2 py-1 text-[10px] font-semibold text-red-600 transition-colors hover:bg-red-100"
            >
              <ExternalLink className="size-3" />
              View
            </a>
          </div>
        </div>
      )

    case "link":
      return (
        <div
          className={`flex py-2 ${getPaddingClass(section.paddingX)} ${getFlexAlign(section.align)}`}
        >
          <a
            href={section.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group border-default bg-surface hover:border-primary flex w-full max-w-3xl items-start gap-4 rounded-sm border px-3 py-3 shadow-xs transition-all hover:shadow-xs"
          >
            <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-teal-100 bg-teal-50">
              {section.thumbnailUrl ? (
                <Image
                  src={section.thumbnailUrl}
                  alt=""
                  width={80}
                  height={80}
                  className="size-full object-cover"
                />
              ) : section.url ? (
                <Image
                  src={`https://www.google.com/s2/favicons?domain=${new URL(section.url).hostname}&sz=256`}
                  alt=""
                  width={64}
                  height={64}
                  unoptimized
                  className="size-16 object-contain"
                />
              ) : (
                <Link2 className="size-12 text-teal-600" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-foreground group-hover:text-primary text-sm font-semibold transition-colors">
                {section.title}
              </p>
              {section.description && (
                <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                  {section.description}
                </p>
              )}
              <p className="text-muted-foreground/80 mt-1.5 truncate text-[10px]">
                {section.url}
              </p>
            </div>
            <ExternalLink className="text-muted-foreground group-hover:text-primary mt-1 size-4 shrink-0 transition-colors" />
          </a>
        </div>
      )

    case "task":
      return (
        <div className={`py-2 bg-indigo-50/30 ${getPaddingClass(section.paddingX)}`}>
          <div
            className={`max-w-2xl space-y-4 rounded-sm border border-indigo-100 bg-white p-5 shadow-xs ${getAlignClass(section.align)}`}
          >
            <div className="flex items-center gap-3 border-b border-indigo-50 pb-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-indigo-100">
                <CheckSquare className="size-4 text-indigo-700" />
              </div>
              <div>
                <h3 className="text-foreground text-base font-bold">
                  {section.title}
                </h3>
                {section.deadline && (
                  <p className="mt-1 text-[10px] font-bold tracking-wider text-indigo-600 uppercase">
                    Due: {new Date(section.deadline).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
            {section.description && (
              <div
                className="text-muted text-sm leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: preprocessHtml(section.description),
                }}
              />
            )}
            <div className="pt-2">
              <button
                type="button"
                className="w-full rounded-sm bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 sm:w-auto"
              >
                {section.submissionType === "file"
                  ? "Upload Submission"
                  : section.submissionType === "url"
                    ? "Submit Link"
                    : "Write Response"}
              </button>
            </div>
          </div>
        </div>
      )
    case "columns": {
      const cols = (section as any).cols || []
      const count = (section as any).columnCount || 2
      return (
        <div
          className={`grid items-start gap-4 py-4 ${getPaddingClass(section.paddingX)}`}
          style={{ gridTemplateColumns: `repeat(${count}, 1fr)` }}
        >
          {cols.map((col: any) => (
            <div key={col.id} className="min-w-0">
              {col.type === "rich_text" && (
                <div
                  className="px-4 py-3 rich-content text-foreground/80 text-[14px] leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: preprocessHtml(col.content || ""),
                  }}
                />
              )}
              {col.type === "image" && col.url && (
                <figure className="p- flex flex-col items-center gap-2">
                  <Image
                    src={col.url}
                    alt={col.caption ?? ""}
                    width={600}
                    height={400}
                    className="max-h-64 w-full rounded-sm object-contain"
                    loading="lazy"
                  />
                  {col.caption && (
                    <figcaption className="text-muted text-center text-[11px] italic">
                      {col.caption}
                    </figcaption>
                  )}
                </figure>
              )}
              {col.type === "image" && !col.url && (
                <div className="text-muted bg-subtle border-default m-3 flex h-24 items-center justify-center rounded-sm border border-dashed text-xs">
                  No image
                </div>
              )}
              {col.type === "video" && col.url && (
                <div className="p-3">
                  <VideoRenderer url={col.url} title={col.title} />
                </div>
              )}
              {col.type === "video" && !col.url && (
                <div className="text-muted bg-subtle border-default m-3 flex h-24 items-center justify-center rounded-sm border border-dashed text-xs">
                  No video URL
                </div>
              )}
              {col.type === "pdf" && (
                <div className="p-3">
                  <a
                    href={col.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-surface flex items-center gap-3 rounded-sm px-3 py-2.5 transition-all hover:shadow-xs"
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-sm border border-red-100 bg-red-50">
                      <FileText className="size-4 text-red-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {col.filename || "Document"}
                      </p>
                      <p className="text-muted text-[9px] font-semibold tracking-wide uppercase">
                        PDF
                      </p>
                    </div>
                    <ExternalLink className="text-muted size-3.5 shrink-0" />
                  </a>
                </div>
              )}
              {col.type === "link" && (
                <div className="p-3">
                  <a
                    href={col.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-surface flex items-start gap-3 rounded-sm px-3 py-2.5 transition-all hover:shadow-xs"
                  >
                    <div className="mt-0.5 flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-teal-100 bg-teal-50 p-1.5">
                      {col.thumbnailUrl ? (
                        <Image
                          src={col.thumbnailUrl}
                          alt=""
                          width={48}
                          height={48}
                          className="size-full object-cover"
                        />
                      ) : col.url ? (
                        <Image
                          src={`https://www.google.com/s2/favicons?domain=${new URL(col.url).hostname}&sz=128`}
                          alt=""
                          width={48}
                          height={48}
                          unoptimized
                          className="size-full object-contain"
                        />
                      ) : (
                        <Link2 className="size-full text-teal-600" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="group-hover:text-primary text-sm font-semibold transition-colors">
                        {col.title || "Link"}
                      </p>
                      {col.description && (
                        <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">
                          {col.description}
                        </p>
                      )}
                      <p className="text-muted-foreground/80 mt-1 truncate text-[10px]">
                        {col.url}
                      </p>
                    </div>
                    <ExternalLink className="text-muted-foreground group-hover:text-primary mt-1 size-3.5 shrink-0 transition-colors" />
                  </a>
                </div>
              )}
              {!col.type && (
                <div className="text-muted bg-subtle border-default m-3 flex h-16 items-center justify-center rounded-sm border border-dashed text-xs">
                  Empty column
                </div>
              )}
            </div>
          ))}
          {cols.length === 0 && (
            <div className="text-muted col-span-full py-6 text-center text-xs italic">
              No columns yet
            </div>
          )}
        </div>
      )
    }

    default:
      return null
  }
}

interface LessonSectionViewerProps {
  sections: LessonSection[]
  pagePadding?: "none" | "sm" | "md" | "lg" | "xl"
  pageBgColor?: string // ADD THIS LINE
}

export function LessonSectionViewer({
  sections,
  pagePadding,
  pageBgColor,
}: LessonSectionViewerProps) {
  if (!sections || sections.length === 0) return null

  const paddingCls =
    pagePadding === "sm"
      ? "px-4 sm:px-8"
      : pagePadding === "md"
        ? "px-6 sm:px-12"
        : pagePadding === "lg"
          ? "px-8 sm:px-16 lg:px-24"
          : pagePadding === "xl"
            ? "px-10 sm:px-20 lg:px-32"
            : ""

  return (
    <div
      className={`flex flex-col overflow-hidden py-6 ${paddingCls}`}
      style={{ backgroundColor: pageBgColor || "transparent" }}
    >
      {sections.map((section) => (
        <div
          key={section.id}
          style={{ backgroundColor: section.bgColor || "transparent" }}
        >
          <SectionBlock section={section} />
        </div>
      ))}
    </div>
  )
}
