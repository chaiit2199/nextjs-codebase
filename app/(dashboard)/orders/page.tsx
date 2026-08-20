import type { Metadata } from "next";
import { Dashboard } from "@/components/dashboard";

export const metadata: Metadata = { title: "Quản lý đơn hàng" };

export default function Page() {
  return <Dashboard id="orders-main" />;
}
