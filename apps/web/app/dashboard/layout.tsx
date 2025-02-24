"use client";
// Import Footer
import { useState } from "react";
// import Footer from "../components/Footer";
import Topbar from "../components/topBar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  // const [currentPage, setCurrentPage] = useState(1);
  // const totalPages = 10; // Example total pages, can be dynamic

  // const handlePageChange = (pageNumber: number) => {
  //   setCurrentPage(pageNumber);
  // };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Bar */}
      <Topbar/>

      {/* Main Content */}
      <main className="flex-grow p-6">{children}</main>

      {/* Footer with Pagination */}
      {/* <Footer
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={handlePageChange} 
      /> */}
    </div>
  );
}
