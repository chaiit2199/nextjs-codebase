"use client";

import { useState } from "react";

import { Icon } from "@/components/icon";
import type { Permission } from "@/lib/api/types";

type PermissionGroup = {
  id: string;
  name: string;
  actions: Permission[];
};

function uniqueSortedIds(ids: number[]) {
  return [...new Set(ids)].sort((a, b) => a - b);
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

function groupEnabled(selectedIds: number[], group: PermissionGroup) {
  return group.actions.some((action) => selectedIds.includes(action.id));
}

export function SelectRoles({
  permissions,
  selectedPermissionIds = [],
}: {
  permissions: Permission[];
  selectedPermissionIds?: number[];
}) {
  const groups = groupPermissions(permissions);
  const [permissionIds, setPermissionIds] = useState(() => uniqueSortedIds(selectedPermissionIds));

  function togglePage(group: PermissionGroup) {
    const ids = group.actions.map((action) => action.id);

    setPermissionIds((current) => {
      if (ids.some((id) => current.includes(id))) {
        return current.filter((id) => !ids.includes(id));
      }
      return uniqueSortedIds([...current, ...ids]);
    });
  }

  function toggleAction(id: number) {
    setPermissionIds((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      return uniqueSortedIds([...current, id]);
    });
  }

  return (
    <div className="auth-permission" id="permission-matrix">
      {permissionIds.map((id) => (
        <input key={id} type="hidden" name="permission_ids" value={id} />
      ))}
      <div className="auth-permission__head">
        <h3 className="auth-permission__title">Quyền truy cập</h3>
      </div>

      <div className="auth-permission__list">
        {groups.map((group) => {
          const isPageEnabled = groupEnabled(permissionIds, group);

          return (
            <div
              key={group.id}
              id={`permission-page-${group.id}`}
              className={["auth-permission__item", isPageEnabled && "is-enabled"].filter(Boolean).join(" ")}
            >
              <button
                type="button"
                className={["auth-permission__page", isPageEnabled && "is-checked"].filter(Boolean).join(" ")}
                onClick={() => togglePage(group)}
              >
                <span
                  className={["auth-permission__check", isPageEnabled && "is-checked"].filter(Boolean).join(" ")}
                >
                  {isPageEnabled && <Icon name="hero-check" className="size-3.5" />}
                </span>
                <span>{group.name}</span>
              </button>

              <div className="auth-permission__actions">
                {group.actions.map((action) => {
                  const isActionEnabled = permissionIds.includes(action.id);

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
                      onClick={() => toggleAction(action.id)}
                    >
                      <span
                        className={["auth-permission__check", isActionEnabled && "is-checked"].filter(Boolean).join(" ")}
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
