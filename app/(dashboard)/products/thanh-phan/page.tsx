import type { Metadata } from "next";
import { DashMain } from "@/components/admin/dash-main";

export const metadata: Metadata = { title: "Quản lý thành phần" };

export default function Page() {
  return <DashMain id="products-main" />;
}
