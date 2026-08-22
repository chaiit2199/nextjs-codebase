import type { Metadata } from "next";

import { WipPage } from "@/components/dashboard";

export const metadata: Metadata = { title: "Quản lý thành phẩm" };

export default function Page() {
  return <WipPage id="products-main" />;
}
