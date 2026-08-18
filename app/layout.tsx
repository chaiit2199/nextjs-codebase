import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Code Base",
  description: "Code Base Blog",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
