import type { Metadata } from "next";

import { WipPage } from "@/components/dashboard";

export const metadata: Metadata = { title: "Quản lý đơn hàng" };

export default function Page() {
  return <WipPage id="orders-main" />;
}
