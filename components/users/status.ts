export enum UserStatus {
  Inactive = 0,
  Active = 1,
}

const USER_STATUS_MAP = {
  [UserStatus.Inactive]: { kind: "paused", label: "Ngưng hoạt động" },
  [UserStatus.Active]: { kind: "active", label: "Đang hoạt động" },
} as const;

const UNKNOWN_STATUS = { kind: "new", label: "—" } as const;

export function userStatusMeta(status?: number) {
  if (status === UserStatus.Inactive || status === UserStatus.Active) {
    return USER_STATUS_MAP[status];
  }

  return UNKNOWN_STATUS;
}
