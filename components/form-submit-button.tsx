"use client";

import { useFormStatus } from "react-dom";

export function FormSubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="core_button core_button--primary" disabled={pending}>
      {pending ? "Đang lưu..." : children}
    </button>
  );
}
