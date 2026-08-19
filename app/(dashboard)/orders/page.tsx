import type { Metadata } from "next";
import { DashMain } from "@/components/admin/dash-main";

export const metadata: Metadata = { title: "Quản lý đơn hàng" };

export default function Page() {
  return <DashMain id="orders-main" />;
}
