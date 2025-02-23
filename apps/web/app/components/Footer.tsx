"use client";

import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink } from "@/components/ui/pagination";

interface FooterProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
}

export function Footer({ currentPage, totalPages, onPageChange }: FooterProps) {
  return (
    <footer className=" text-center py-4 mt-auto">
      <Pagination className="flex justify-center">
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious onClick={() => onPageChange(currentPage - 1)} />
            </PaginationItem>
          )}

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                className={currentPage === pageNumber ? "bg-gray-300" : ""}
                onClick={() => onPageChange(pageNumber)}
              >
                {/* {pageNumber} */}
              </PaginationLink>
            </PaginationItem>
          ))}

          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationNext onClick={() => onPageChange(currentPage + 1)} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>

      {/* <p className="mt-2 text-sm">&copy; {new Date().getFullYear()} Notes App. All rights reserved.</p> */}
    </footer>
  );
}

export default Footer;
