"use client";

import { useState } from "react";

import type { Role } from "@/lib/api/me";
import { Icon } from "@/components/icon";

const PERMISSION_PAGES = [
  { id: "dashboard", label: "Dashboard" },
  { id: "products_costs", label: "Quản lý giá vốn" },
  { id: "products_ingredients", label: "Quản lý thành phần" },
  { id: "products_packages", label: "Quản lý bao bì" },
  { id: "products_capital", label: "Quản lý sản phẩm" },
  { id: "orders", label: "Quản lý đơn hàng" },
  { id: "agents", label: "Quản lý đại lý" },
  { id: "employees", label: "Nhân viên" },
  { id: "departments", label: "Phòng ban" },
  { id: "permission_groups", label: "Nhóm quyền" },
  { id: "promotions", label: "Khuyến mãi" },
  { id: "authorization", label: "Phân quyền" },
] as const;

const PERMISSION_ACTIONS = [
  { id: "read", label: "Xem" },
  { id: "write", label: "Thêm" },
  { id: "edit", label: "Sửa" },
  { id: "delete", label: "Xóa" },
  { id: "import", label: "Import" },
  { id: "export", label: "Export" },
] as const;

function permissionCode(page: string, action: string) {
  return `${page}.${action}`;
}

function uniqueSorted(codes: string[]) {
  return [...new Set(codes)].sort();
}

function pageEnabled(permissions: string[], page: string) {
  const prefix = `${page}.`;
  return permissions.some((code) => code.startsWith(prefix));
}

function grantsToPermissions(role: Role) {
  return uniqueSorted(role.grants.map((grant) => grant.permission_code.replace(":", ".")));
}

export function SelectRoles({ role }: { role: Role }) {
  const [permissions, setPermissions] = useState(() => grantsToPermissions(role));

  function togglePage(page: string) {
    setPermissions((current) => {
      if (pageEnabled(current, page)) {
        const prefix = `${page}.`;
        return current.filter((code) => !code.startsWith(prefix));
      }
      return uniqueSorted([...current, permissionCode(page, "read")]);
    });
  }

  function toggleAction(page: string, action: string) {
    const code = permissionCode(page, action);
    setPermissions((current) => {
      if (current.includes(code)) return current.filter((item) => item !== code);
      return uniqueSorted([...current, code]);
    });
  }

  return (
    <div className="auth-permission" id="permission-matrix">
      {permissions.map((code) => (
        <input key={code} type="hidden" name="permissions" value={code} />
      ))}
      <div className="auth-permission__head">
        <h3 className="auth-permission__title">Quyền truy cập</h3>
      </div>

      <div className="auth-permission__list">
        {PERMISSION_PAGES.map((page) => {
          const isPageEnabled = pageEnabled(permissions, page.id);

          return (
            <div
              key={page.id}
              id={`permission-page-${page.id}`}
              className={["auth-permission__item", isPageEnabled && "is-enabled"]
                .filter(Boolean)
                .join(" ")}
            >
              <button
                type="button"
                className={["auth-permission__page", isPageEnabled && "is-checked"]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => togglePage(page.id)}
              >
                <span
                  className={["auth-permission__check", isPageEnabled && "is-checked"]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {isPageEnabled && <Icon name="hero-check" className="size-3.5" />}
                </span>
                <span>{page.label}</span>
              </button>

              <div className="auth-permission__actions">
                {PERMISSION_ACTIONS.map((action) => {
                  const isActionEnabled = permissions.includes(permissionCode(page.id, action.id));

                  return (
                    <button
                      key={action.id}
                      type="button"
                      className={[
                        "auth-permission__action",
                        isActionEnabled && "is-checked",
                        !isPageEnabled && "is-disabled",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      disabled={!isPageEnabled}
                      onClick={() => toggleAction(page.id, action.id)}
                    >
                      <span
                        className={["auth-permission__check", isActionEnabled && "is-checked"]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        {isActionEnabled && <Icon name="hero-check" className="size-3.5" />}
                      </span>
                      <span>{action.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
