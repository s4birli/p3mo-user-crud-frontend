import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "P3MO User Management System",
  description: "User Management System for P3MO Developer Challenge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
          <footer className="border-t py-4 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} P3MO User Management System
          </footer>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
