import type { Metadata } from "next";

import { ComingSoon, Dashboard } from "@/components/dashboard";

export const metadata: Metadata = { title: "Phân quyền" };

export default function Page() {
  return (
    <Dashboard id="authorization-main">
      <ComingSoon />
    </Dashboard>
  );
}
