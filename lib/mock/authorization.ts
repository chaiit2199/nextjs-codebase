export type MockUserOption = {
  id: string;
  fullName: string;
  username: string;
  departmentName: string;
  label: string;
};

export type MockRoleOption = {
  id: string;
  name: string;
};

export type Warehouse = {
  code: string;
  name: string;
};

export type AuthorizationRow = {
  id: string;
  userId: string;
  fullName: string;
  username: string;
  departmentName: string;
  roleId?: string;
  roleName?: string;
  warehouseCode?: string;
};

export const MOCK_USERS: MockUserOption[] = [
  {
    id: "u1",
    fullName: "Nguyễn Trần Trung",
    username: "trungnt",
    departmentName: "Kho vận",
    label: "Nguyễn Trần Trung (@trungnt)",
  },
  {
    id: "u2",
    fullName: "Lê Thị Mai",
    username: "mailt",
    departmentName: "Kho vận",
    label: "Lê Thị Mai (@mailt)",
  },
  {
    id: "u3",
    fullName: "Phạm Văn Hùng",
    username: "hungpv",
    departmentName: "Kinh doanh",
    label: "Phạm Văn Hùng (@hungpv)",
  },
];

export const MOCK_ROLES: MockRoleOption[] = [
  { id: "r1", name: "thủ kho 2" },
  { id: "r2", name: "quản lý kho" },
  { id: "r3", name: "nhân viên bán hàng" },
];

export const MOCK_WAREHOUSES: Warehouse[] = [
  { code: "DEMO_WH_LA", name: "Kho khu vực Long An" },
  { code: "DEMO_WH_TG", name: "Kho khu vực Tiền Giang" },
  { code: "DEMO_WH_VL", name: "Kho khu vực Vĩnh Long" },
];

export const MOCK_AUTHORIZATIONS: AuthorizationRow[] = [
  {
    id: "1",
    userId: "u1",
    fullName: "Nguyễn Trần Trung",
    username: "trungnt",
    departmentName: "Kho vận",
    roleId: "r1",
    roleName: "thủ kho 2",
    warehouseCode: "DEMO_WH_LA",
  },
  {
    id: "2",
    userId: "u2",
    fullName: "Lê Thị Mai",
    username: "mailt",
    departmentName: "Kho vận",
    roleId: "r2",
    roleName: "quản lý kho",
    warehouseCode: "DEMO_WH_VL",
  },
  {
    id: "3",
    userId: "u3",
    fullName: "Phạm Văn Hùng",
    username: "hungpv",
    departmentName: "Kinh doanh",
  },
];

export function warehouseOptionLabel(code: string): string {
  const warehouse = MOCK_WAREHOUSES.find((item) => item.code === code);
  return warehouse ? `${warehouse.code} — ${warehouse.name}` : code;
}
