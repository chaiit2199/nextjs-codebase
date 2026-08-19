import type { Metadata } from "next";
import { DashMain } from "@/components/admin/dash-main";

export const metadata: Metadata = { title: "Quản lý sản phẩm" };

export default function Page() {
  return <DashMain id="products-main" />;
}
