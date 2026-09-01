"use client";

import { Dashboard } from "@/components/dashboard";
import { LoadError } from "@/components/load_error";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Dashboard id="error">
      <section className="section">
        <div className="section-table">
          <LoadError message={error.message} onRetry={reset} />
        </div>
      </section>
    </Dashboard>
  );
}
