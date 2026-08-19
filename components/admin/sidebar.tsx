"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type SidebarUser = {
  full_name?: string;
  username?: string;
};

type NavItem = {
  href?: string;
  label: string;
  icon: React.ReactNode;
  children?: { href: string; label: string }[];
};

const NAV: NavItem[] = [
  {
    href: "/",
    label: "Dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="8" height="8" rx="1.5" />
        <rect x="13" y="3" width="8" height="5" rx="1.5" />
        <rect x="13" y="10" width="8" height="11" rx="1.5" />
        <rect x="3" y="13" width="8" height="8" rx="1.5" />
      </svg>
    ),
  },
  {
    label: "Sản phẩm",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      </svg>
    ),
    children: [
      { href: "/products", label: "Danh sách sản phẩm" },
      { href: "/products/gia-von", label: "Quản lý giá vốn" },
      { href: "/products/new", label: "Thêm sản phẩm" },
    ],
  },
  {
    href: "/orders",
    label: "Quản lý đơn hàng",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M6 2h12l1 7H5l1-7z" />
        <path d="M3 9h18v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
        <path d="M9 13h6" />
      </svg>
    ),
  },
  {
    href: "/agents",
    label: "Quản lý đại lý",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="9" cy="8" r="3" />
        <circle cx="16" cy="9" r="2.5" />
        <path d="M3 19c0-3 2.5-5 6-5s6 2 6 5" />
        <path d="M14 19c0-2 1.5-3.5 4-3.5s4 1.5 4 3.5" />
      </svg>
    ),
  },
  {
    href: "/promotions",
    label: "Khuyến mãi",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L3 13V3h10l7.59 7.59a2 2 0 0 1 0 2.82z" />
        <circle cx="7.5" cy="7.5" r="1.5" />
      </svg>
    ),
  },
  {
    label: "Quản lý",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    children: [
      { href: "/staff", label: "Nhân viên" },
      { href: "/settings", label: "Cài đặt" },
    ],
  },
];

function isChildActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar({ user }: { user?: SidebarUser | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);
  const displayName = user?.full_name || user?.username || "User";
  const initial = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    const match = NAV.find((item) =>
      item.children?.some((child) => isChildActive(pathname, child.href)),
    );
    if (match) setOpen(match.label);
  }, [pathname]);

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__brand">
        <span className="admin-sidebar__logo" aria-hidden>
          <svg viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" fill="#3b6e4b" />
            <path d="M16 8c4 4 6 7 6 11a6 6 0 1 1-12 0c0-4 2-7 6-11z" fill="#fff" />
          </svg>
        </span>
        <span className="admin-sidebar__title">USA FARM AGRI</span>
      </div>

      <nav className="admin-sidebar__nav">
        {NAV.map((item) => {
          const isOpen = open === item.label;
          const isActive = item.href
            ? pathname === item.href
            : Boolean(item.children?.some((child) => isChildActive(pathname, child.href)));

          if (item.children) {
            return (
              <div key={item.label} className="admin-sidebar__group">
                <button
                  type="button"
                  className={`admin-sidebar__item ${isActive ? "is-active" : ""}`}
                  onClick={() => setOpen(isOpen ? null : item.label)}
                >
                  <span className="admin-sidebar__icon">{item.icon}</span>
                  <span>{item.label}</span>
                  <span className={`admin-sidebar__chevron ${isOpen ? "is-open" : ""}`}>
                    ›
                  </span>
                </button>
                {isOpen && (
                  <div className="admin-sidebar__sub">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`admin-sidebar__sub-item ${pathname === child.href ? "is-active" : ""}`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href!}
              className={`admin-sidebar__item ${isActive ? "is-active" : ""}`}
            >
              <span className="admin-sidebar__icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="admin-sidebar__user">
        <span className="admin-sidebar__avatar">{initial}</span>
        <span className="admin-sidebar__user-meta">
          <strong>{displayName}</strong>
          <small>Nhân viên</small>
        </span>
        <form action="/api/logout" method="post">
          <button type="submit" className="admin-sidebar__logout" title="Đăng xuất">
            ›
          </button>
        </form>
      </div>
    </aside>
  );
}
