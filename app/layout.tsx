import "./app.scss";
import { ThemeToggle } from "@/components/theme-toggle";
import type { Metadata } from "next";
import { customMetadata } from "@/components/custom-metadata";
export const metadata: Metadata = customMetadata;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col">
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
