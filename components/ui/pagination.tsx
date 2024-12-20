"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQueryState } from "nuqs";

const PaginatedComponent = ({
  totalPages,
  currentPage,
  className,
}: {
  totalPages: number;
  currentPage: number;
  className?: string;
}) => {
  const [page, setPage] = useQueryState("page", {
    defaultValue: "",
    shallow: false,
  });

  const handlePageChange = (page: number) => {
    setPage(page.toString());
  };

  const generatePages = () => {
    const pages = [];
    const current = Number(currentPage);

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (current > 3) pages.push("...");

      for (
        let i = Math.max(2, current - 1);
        i <= Math.min(totalPages - 1, current + 1);
        i++
      ) {
        pages.push(i);
      }

      if (current < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div
      className={cn("flex flex-wrap  max-w-xl  gap-5 mr-auto  ", className)}
      dir="ltr"
    >
      {/* Previous Button */}
      <button
        disabled={Number(currentPage) === 1}
        onClick={() => handlePageChange(Number(currentPage) - 1)}
        className={`p-1.5 rounded-lg border ${
          Number(currentPage) === 1
            ? "text-gray-400 border-gray-200 cursor-not-allowed "
            : "bg-primary text-white hover:bg-primary hover:text-white transition-all duration-500 hover:border-transparent"
        }`}
      >
        <ChevronLeft size={17} />
      </button>
      {/* Page Numbers */}
      {generatePages().map((page, index) => (
        <React.Fragment key={index}>
          {page === "..." ? (
            <span className="px-3 py-1 text-gray-500">...</span>
          ) : (
            <div
              onClick={() => handlePageChange(Number(page))}
              className={cn(
                "px-3 py-1 rounded-lg border max-w-max text-sm  text-primary bg-transparent border-primary hover:bg-primary hover:text-white transition-all duration-500 hover:border-soft_primary cursor-pointer",
                {
                  "bg-primary border-soft_primary text-white ":
                    Number(page) === Number(currentPage),
                }
              )}
            >
              {page}
            </div>
          )}
        </React.Fragment>
      ))}
      {/* Next Button */}
      <button
        disabled={Number(currentPage) === totalPages}
        onClick={() => handlePageChange(Number(currentPage) + 1)}
        className={`p-1.5 rounded-lg border ${
          Number(currentPage) === totalPages
            ? "text-gray-400 border-gray-200 cursor-not-allowed  "
            : "bg-primary text-white  transition-all duration-500 hover:border-transparent"
        }`}
      >
        <ChevronRight size={17} />
      </button>
    </div>
  );
};

export default PaginatedComponent;
