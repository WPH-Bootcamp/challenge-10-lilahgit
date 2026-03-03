import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  page: number;
  lastPage: number;
  basePath: string;
  query?: string;
  extraParams?: Record<string, string | number | undefined>;
};

export default function Pagination({
  page,
  lastPage,
  basePath,
  query,
  extraParams,
}: PaginationProps) {
  if (lastPage <= 1) return null;

  const prevPage = Math.max(1, page - 1);
  const nextPage = Math.min(lastPage, page + 1);
  const startPage = Math.max(1, page - 1);
  const endPage = Math.min(lastPage, startPage + 2);
  const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  const createHref = (targetPage: number) => {
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (extraParams) {
      Object.entries(extraParams).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") return;
        params.set(key, String(value));
      });
    }
    params.set("page", String(targetPage));
    return `${basePath}?${params.toString()}`;
  };

  return (
    <div className="pagination-text-mobile md:pagination-text-desktop flex w-full items-center justify-center gap-4 text-neutral-600">
      <Link
        href={createHref(prevPage)}
        className={`flex items-center gap-2 ${page === 1 ? "pointer-events-none opacity-40" : ""}`}
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Previous
      </Link>
      <div className="flex items-center gap-2">
        {pageNumbers.map((pageNumber) =>
          pageNumber === page ? (
            <span
              key={pageNumber}
              className="pagination-btn-mobile md:pagination-btn-desktop flex items-center justify-center rounded-full bg-primary-300 text-white"
            >
              {pageNumber}
            </span>
          ) : (
            <Link key={pageNumber} href={createHref(pageNumber)} className="px-2 text-neutral-600">
              {pageNumber}
            </Link>
          )
        )}
      </div>
      <Link
        href={createHref(nextPage)}
        className={`flex items-center gap-2 ${page === lastPage ? "pointer-events-none opacity-40" : ""}`}
      >
        Next
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  );
}

