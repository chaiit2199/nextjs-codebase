"use client";

import { Dashboard } from "@/components/dashboard";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <Dashboard id="error">
      <h2>Không tải được dữ liệu</h2>
      <button type="button" className="core_button core_button--primary" onClick={reset}>
        Thử lại
      </button>
    </Dashboard>
  );
}
