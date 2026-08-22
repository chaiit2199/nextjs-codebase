import type { Metadata } from "next";
import { Dashboard } from "@/components/dashboard";

export const metadata: Metadata = { title: "Quản lý sản phẩm" };

export default function Page() {
  return <Dashboard id="products-main" />;
}
