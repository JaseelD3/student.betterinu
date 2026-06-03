export function ProgressDots({
  total,
  active,
}: {
  total: number
  active: number
}) {
  return (
    <div
      className="flex gap-2"
      aria-label={`Question ${active + 1} of ${total}`}
    >
      {Array.from({ length: total }, (_, index) => (
        <span
          className={
            index <= active
              ? "bg-primary size-2 rounded-full"
              : "bg-muted size-2 rounded-full"
          }
          key={index}
        />
      ))}
    </div>
  )
}
