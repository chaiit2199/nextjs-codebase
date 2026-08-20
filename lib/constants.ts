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
  