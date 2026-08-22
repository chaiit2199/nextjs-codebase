import type { Metadata } from "next";

import { ComingSoon, Dashboard } from "@/components/dashboard";

export const metadata: Metadata = { title: "Quản lý thành phần" };

export default function Page() {
  return (
    <Dashboard id="products-main">
      <ComingSoon />
    </Dashboard>
  );
}
