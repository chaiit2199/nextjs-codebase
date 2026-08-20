import type { Metadata } from "next";
import { Dashboard } from "@/components/dashboard";

export const metadata: Metadata = { title: "Quản lý đại lý" };

export default function Page() {
  return <Dashboard id="agents-main" />;
}
