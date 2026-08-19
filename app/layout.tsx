import "./app.scss";
import type { Metadata, Viewport } from "next";
import { customMetadata, customViewport } from "@/components/custom-metadata";

export const metadata: Metadata = customMetadata;
export const viewport: Viewport = customViewport;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
