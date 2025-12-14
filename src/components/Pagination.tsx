import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: PaginationProps) {
  // Generer sideknapper med ellipsis for mange sider
  const getPageNumbers = () => {
    const pages = [];
    const showEllipsisStart = currentPage > 3;
    const showEllipsisEnd = currentPage < totalPages - 2;

    if (totalPages <= 7) {
      // Vis alle sider hvis det er 7 eller færre
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Alltid vis første side
      pages.push(1);

      if (showEllipsisStart) {
        pages.push('ellipsis');
      }

      // Vis sider rundt nåværende side
      for (let i = Math.max(2, currentPage - 1); 
           i <= Math.min(totalPages - 1, currentPage + 1); 
           i++) {
        pages.push(i);
      }

      if (showEllipsisEnd) {
        pages.push('ellipsis');
      }

      // Alltid vis siste side
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2">
      {/* Forrige-knapp */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "p-2 rounded-lg transition-colors",
          currentPage === 1
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-600 hover:bg-gray-100"
        )}
        aria-label="Forrige side"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Sideknapper */}
      {getPageNumbers().map((page, index) => (
        page === 'ellipsis' ? (
          <span
            key={`ellipsis-${index}`}
            className="px-4 py-2 text-gray-400"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className={cn(
              "min-w-[40px] h-10 px-4 rounded-lg transition-colors",
              currentPage === page
                ? "bg-violet-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            {page}
          </button>
        )
      ))}

      {/* Neste-knapp */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "p-2 rounded-lg transition-colors",
          currentPage === totalPages
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-600 hover:bg-gray-100"
        )}
        aria-label="Neste side"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}