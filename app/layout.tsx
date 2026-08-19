import "@/scss/app.scss";
import type { Metadata, Viewport } from "next";
import { customMetadata, customViewport } from "@/components/custom-metadata";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
export const metadata: Metadata = customMetadata;
export const viewport: Viewport = customViewport;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html className={inter.className} lang="vi">
      <body>{children}</body>
    </html>
  );
}
