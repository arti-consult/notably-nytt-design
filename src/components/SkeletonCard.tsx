import { cn } from '@/lib/utils';

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div className={cn("feature-card dashboard-card animate-pulse", className)}>
      <div className="flex items-center space-x-4">
        {/* Icon skeleton */}
        <div className="w-12 h-12 bg-gray-200 rounded-xl flex-shrink-0"></div>

        {/* Content skeleton */}
        <div className="flex-1 space-y-2">
          {/* Title */}
          <div className="h-5 bg-gray-200 rounded w-1/3"></div>

          {/* Metadata */}
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>

          {/* Tags */}
          <div className="flex gap-2">
            <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
            <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonCardList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
