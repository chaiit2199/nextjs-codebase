export const ORDER_STATUSES = [
  { label: "Chờ giao", value: "pending", color: "#E8A45A" },
  { label: "Đang xử lý", value: "processing", color: "#F97316" },
  { label: "Đang giao", value: "shipping", color: "#7C3AED" },
  { label: "Sắp đến hạn", value: "due_soon", color: "#C4A35A" },
  { label: "Quá hạn", value: "overdue", color: "#D4727D" },
  { label: "Hủy", value: "cancelled", color: "#DC2626" },
  { label: "Hoàn thành", value: "completed", color: "#3B7A57" },
] as const;

export function orderLabel(status: string) {
  return ORDER_STATUSES.find((item) => item.value === status)?.label ?? "Không xác định";
}

export function orderColor(status: string) {
  return ORDER_STATUSES.find((item) => item.value === status)?.color ?? "#94A3B8";
}

export const ORDER_SERIES = [
  { status: "completed", value: 180 },
  { status: "processing", value: 93 },
  { status: "shipping", value: 65 },
  { status: "cancelled", value: 3 },
].map((item) => ({
  ...item,
  label: orderLabel(item.status),
  color: orderColor(item.status),
}));

/** API payload: 0 = đang hoạt động, 1 = ngưng hoạt động. */
export enum UserStatus {
  Active = 1,
  Inactive = 0,
}

export type RecordStatus = UserStatus.Active | UserStatus.Inactive;

const RECORD_STATUS_META = {
  [UserStatus.Active]: { kind: "active", label: "Đang hoạt động" },
  [UserStatus.Inactive]: { kind: "paused", label: "Ngưng hoạt động" },
} as const;

const UNKNOWN_STATUS = { kind: "new", label: "—" } as const;

export const RECORD_STATUS_OPTIONS = [
  { value: UserStatus.Active, label: RECORD_STATUS_META[UserStatus.Active].label },
  { value: UserStatus.Inactive, label: RECORD_STATUS_META[UserStatus.Inactive].label },
] as const;

export function isRecordStatus(value: number): value is RecordStatus {
  return value === UserStatus.Active || value === UserStatus.Inactive;
}

export function readFormStatus(data: FormData, field = "status"): RecordStatus | undefined {
  const value = Number(data.get(field));
  return isRecordStatus(value) ? value : undefined;
}

export function recordStatusMeta(status?: number) {
  if (status === UserStatus.Active || status === UserStatus.Inactive) {
    return RECORD_STATUS_META[status];
  }

  return UNKNOWN_STATUS;
}

/** @deprecated Dùng recordStatusMeta — giữ alias cho component user. */
export const userStatusMeta = recordStatusMeta;

/** Role API trả status dạng chuỗi ACTIVE / INACTIVE. */
export const RoleStatus = {
  Active: "ACTIVE",
  Inactive: "INACTIVE",
} as const;

export function roleStatusMeta(status?: string) {
  if (status === RoleStatus.Active) return RECORD_STATUS_META[UserStatus.Active];
  if (status === RoleStatus.Inactive) return RECORD_STATUS_META[UserStatus.Inactive];
  return UNKNOWN_STATUS;
}
