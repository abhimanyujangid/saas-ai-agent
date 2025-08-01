 import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";


// Import the TRPC React Provider
import { TRPCReactProvider } from "@/trpc/client";


const inter = Inter({
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TRPCReactProvider>
      <html lang="en">
      <body
        className={`${inter.className}  antialiased`}
      >
        <Toaster />
        {children}
      </body>
    </html>
    </TRPCReactProvider>
  );
}
