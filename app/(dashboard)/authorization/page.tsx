import type { Metadata } from "next";

import { WipPage } from "@/components/dashboard";

export const metadata: Metadata = { title: "Phân quyền" };

export default function Page() {
  return <WipPage id="authorization-main" />;
}
