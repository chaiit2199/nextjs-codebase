import type { Metadata } from "next";
import { Dashboard } from "@/components/dashboard";

export const metadata: Metadata = { title: "Phòng ban" };

export default function Page() {
  return <Dashboard id="departments-main" />;
}
