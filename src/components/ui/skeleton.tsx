import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-[#111] bg-gradient-to-r from-[#111] via-[#1E1E1E] to-[#111] bg-[length:200%_100%]", className)}
      style={{
        animation: 'shimmer 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }}
      {...props}
    />
  )
}

export { Skeleton }
