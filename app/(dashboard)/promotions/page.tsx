import type { Metadata } from "next";
import { Dashboard } from "@/components/dashboard";

export const metadata: Metadata = { title: "Khuyến mãi" };

export default function Page() {
  return <Dashboard id="promotions-main" />;
}
