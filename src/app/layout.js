import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TransactionProvider } from "@/lib/transaction-context";
import Header from "@/components/header";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "700"],
});

export const metadata = {
  title: "Finance Visualizer",
  description: "Track and visualize your personal finances with ease",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${spaceGrotesk.className}`}>
        <TransactionProvider>
          <Header />
          <main className="flex-1">{children}</main>
        </TransactionProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}

