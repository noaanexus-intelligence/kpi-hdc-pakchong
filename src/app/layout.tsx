import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HDC Pak Chong KPI Coverage",
  description: "Coverage dashboard for HDC Public KPI reports in Pak Chong, Nakhon Ratchasima"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
