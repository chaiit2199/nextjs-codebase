"use client";

import Link from "next/link";

import { EmptyData } from "@/components/empty_data";
import type { IconName } from "@/components/icon";

function errorCopy(message?: string): {
  title: string;
  description: string;
  icon: IconName;
} {
  const text = message?.trim() ?? "";
  const isForbidden = /không có quyền|AUTH_FORBIDDEN/i.test(text);

  if (isForbidden) {
    return {
      title: "Không có quyền truy cập",
      description: text || "Bạn không được thực hiện thao tác này.",
      icon: "hero-lock-closed",
    };
  }

  const isGeneric = !text || /server components render|digest|http request failed/i.test(text);

  return {
    title: "Không tải được dữ liệu",
    description: isGeneric
      ? "Đã xảy ra lỗi khi tải trang. Thử lại hoặc quay về trang chủ."
      : text,
    icon: "hero-exclamation-circle-mini",
  };
}

export function LoadError({
  message,
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  const copy = errorCopy(message);

  return (
    <EmptyData title={copy.title} description={copy.description} icon={copy.icon}>
      <div className="mt-4 flex items-center justify-center gap-2">
        {onRetry && (
          <button type="button" className="core_button core_button--primary" onClick={onRetry}>
            Thử lại
          </button>
        )}
        <Link href="/" className="core_button core_button--secondary">
          Về trang chủ
        </Link>
      </div>
    </EmptyData>
  );
}
