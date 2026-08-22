import type { Metadata } from "next";

import { WipPage } from "@/components/dashboard";

export const metadata: Metadata = { title: "Quản lý thành phần" };

export default function Page() {
  return <WipPage id="products-main" />;
}
