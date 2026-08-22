import type { Metadata } from "next";

import { ComingSoon, Dashboard } from "@/components/dashboard";

export const metadata: Metadata = { title: "Khuyến mãi" };

export default function Page() {
  return (
    <Dashboard id="promotions-main">
      <ComingSoon />
    </Dashboard>
  );
}
