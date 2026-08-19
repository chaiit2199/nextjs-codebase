"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

import { Icon } from "@/components/icon";
import { pageMeta } from "@/lib/admin/nav";

export function DashboardHeader() {
  const pathname = usePathname();
  const meta = pageMeta(pathname);
  const [query, setQuery] = useState("");

  return (
    <header className="header" id="header">
      <div className="header__left">
        <p className="text-2xl font-medium">{meta.title}</p>
      </div>

      <div className="header__actions" id="header-actions">
        <form id="header-search-form" onSubmit={(event) => event.preventDefault()}>
          <div className="header__search">
            <img src="/icons/header-search.svg" alt="" className="size-5 shrink-0" />
            <input
              id="header-search"
              name="query"
              type="text"
              className="header__search-input"
              placeholder="Search"
              autoComplete="off"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            {query !== "" && (
              <button
                type="button"
                id="header-search-clear"
                className="header__search-clear"
                aria-label="Xóa tìm kiếm"
                onClick={() => setQuery("")}
              >
                <Icon name="hero-x-mark" className="size-4" />
              </button>
            )}
          </div>
        </form>

        {meta.authozation && (
          <button type="button" id="header-authozation" className="btn btn--primary">
            <Icon name="hero-shield-check" className="size-4" />
            Phân quyền
          </button>
        )}

        {meta.create && (
          <button type="button" id="header-create" className="btn btn--primary">
            <Icon name="hero-plus" className="size-4" />
            Tạo mới
          </button>
        )}

        {meta.export && (
          <button type="button" id="header-export" className="btn btn--primary">
            <Icon name="hero-arrow-down-tray" className="size-4" />
            Xuất báo cáo
          </button>
        )}

        {meta.filter && (
          <button type="button" id="header-filter" className="btn btn--primary">
            <Icon name="hero-adjustments-horizontal" className="size-4" />
            Bộ lọc
          </button>
        )}
      </div>
    </header>
  );
}
