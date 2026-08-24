"use client";

import { useState } from "react";

import { Icon } from "@/components/icon";
import { SAMPLE_PERMISSIONS, type Permission } from "@/lib/mock/permissions";

type PermissionGroup = {
  id: string;
  name: string;
  actions: Permission[];
};

function uniqueSorted(codes: string[]) {
  return [...new Set(codes)].sort();
}

function groupPermissions(permissions: Permission[]): PermissionGroup[] {
  const groups = new Map<string, PermissionGroup>();

  for (const permission of permissions) {
    const group = groups.get(permission.module_code) ?? {
      id: permission.module_code,
      name: permission.module_name,
      actions: [],
    };
    group.actions.push(permission);
    groups.set(permission.module_code, group);
  }

  return [...groups.values()];
}

function groupEnabled(selected: string[], group: PermissionGroup) {
  return group.actions.some((action) => selected.includes(action.code));
}

export function SelectRoles({ selectedCodes = [] }: { selectedCodes?: string[] }) {
  const groups = groupPermissions(SAMPLE_PERMISSIONS);
  const [permissions, setPermissions] = useState(() => uniqueSorted(selectedCodes));

  function togglePage(group: PermissionGroup) {
    const codes = group.actions.map((action) => action.code);

    setPermissions((current) => {
      if (codes.some((code) => current.includes(code))) {
        return current.filter((code) => !codes.includes(code));
      }
      return uniqueSorted([...current, ...codes]);
    });
  }

  function toggleAction(code: string) {
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
        {groups.map((group) => {
          const isPageEnabled = groupEnabled(permissions, group);

          return (
            <div
              key={group.id}
              id={`permission-page-${group.id}`}
              className={["auth-permission__item", isPageEnabled && "is-enabled"]
                .filter(Boolean)
                .join(" ")}
            >
              <button
                type="button"
                className={["auth-permission__page", isPageEnabled && "is-checked"]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => togglePage(group)}
              >
                <span
                  className={["auth-permission__check", isPageEnabled && "is-checked"]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {isPageEnabled && <Icon name="hero-check" className="size-3.5" />}
                </span>
                <span>{group.name}</span>
              </button>

              <div className="auth-permission__actions">
                {group.actions.map((action) => {
                  const isActionEnabled = permissions.includes(action.code);

                  return (
                    <button
                      key={action.code}
                      type="button"
                      className={[
                        "auth-permission__action",
                        isActionEnabled && "is-checked",
                        !isPageEnabled && "is-disabled",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      disabled={!isPageEnabled}
                      onClick={() => toggleAction(action.code)}
                    >
                      <span
                        className={["auth-permission__check", isActionEnabled && "is-checked"]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        {isActionEnabled && <Icon name="hero-check" className="size-3.5" />}
                      </span>
                      <span>{action.function_name}</span>
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
