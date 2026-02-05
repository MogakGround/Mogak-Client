function SkeletonBox({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-grayscale-800 rounded-[10px] ${className ?? ''}`} />
}

function RoomCardSkeleton() {
  return (
    <div className="flex flex-col gap-[16px]">
      <SkeletonBox className="w-[305px] h-[172px]" />
      <div className="flex flex-col gap-[8px] px-[4px]">
        <SkeletonBox className="w-[120px] h-[20px] rounded-[4px]" />
        <SkeletonBox className="w-[200px] h-[16px] rounded-[4px]" />
      </div>
    </div>
  )
}

export default function HomeSkeleton() {
  return (
    <div className="flex justify-center items-center mt-[40px] w-full">
      <div className="grid grid-cols-1">
        {/* Banner Skeleton */}
        <SkeletonBox className="w-full min-h-[224px] rounded-[12px]" />

        {/* Recent Rooms Section */}
        <div className="flex-row mt-[64px]">
          <SkeletonBox className="w-[160px] h-[14px] rounded-[4px]" />
          <SkeletonBox className="w-[220px] h-[20px] rounded-[4px] mt-[6px]" />
        </div>
        <div className="grid grid-cols-4 mt-[12px] gap-[16px]">
          {Array.from({ length: 4 }).map((_, i) => (
            <RoomCardSkeleton key={i} />
          ))}
        </div>

        {/* Time Filter Section */}
        <div className="flex-row mt-[71px]">
          <SkeletonBox className="w-[160px] h-[20px] rounded-[4px]" />
          <div className="flex gap-[12px] mt-[8px]">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonBox key={i} className="w-[80px] h-[36px] rounded-full" />
            ))}
          </div>
          <div className="grid grid-cols-4 mt-[12px] gap-[16px]">
            {Array.from({ length: 8 }).map((_, i) => (
              <RoomCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
