import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/providers";
import ThemeProvider from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Smart Edu — One Platform. Smarter Schools. Better Student Journeys.",
  description:
    "Smart Edu is a connected digital operating system for schools and student development. School management, Student 360°, AI Assistant, IoT attendance, smart transport, and digital portfolio — all in one platform.",
  keywords: [
    "smart edu",
    "school management",
    "student 360",
    "education platform",
    "edtech",
    "school erp",
    "student development",
    "digital portfolio",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ThemeProvider>
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
