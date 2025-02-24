"use client";
import Topbar from "../components/topBar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar/>
      <main className="flex-grow p-6">{children}</main>
    </div>
  );
}
