export type NavChild = {
  id: string;
  label: string;
  href: string;
  icon: string;
};

export type NavItem = {
  id: string;
  label: string;
  href?: string;
  icon: string;
  children?: NavChild[];
};

export const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Dashboard", href: "/", icon: "hero-squares-2x2" },
  {
    id: "products",
    label: "Sản phẩm",
    icon: "hero-cube",
    children: [
      { id: "costs", label: "Quản lý giá vốn", href: "/products/costs", icon: "hero-currency-dollar" },
      { id: "ingredients", label: "Quản lý thành phần", href: "/products/thanh-phan", icon: "hero-beaker" },
      { id: "packages", label: "Quản lý bao bì", href: "/products/packages", icon: "hero-archive-box" },
      { id: "capital", label: "Quản lý sản phẩm", href: "/products/capital", icon: "hero-calculator" },
    ],
  },
  { id: "orders", label: "Quản lý đơn hàng", href: "/orders", icon: "hero-clipboard-document-list" },
  { id: "agents", label: "Quản lý đại lý", href: "/agents", icon: "hero-users" },
  { id: "promotions", label: "Khuyến mãi", href: "/promotions", icon: "hero-ticket" },
  {
    id: "management",
    label: "Quản lý",
    icon: "hero-building-office-2",
    children: [
      { id: "staff", label: "Nhân viên", href: "/staff", icon: "hero-identification" },
      { id: "departments", label: "Phòng ban", href: "/departments", icon: "hero-user-group" },
      { id: "permission_groups", label: "Nhóm quyền", href: "/permission-groups", icon: "hero-shield-check" },
      { id: "authozation", label: "Phân quyền", href: "/authozation", icon: "hero-cog-6-tooth" },
    ],
  },
];

export type PageMeta = {
  title: string;
  create?: boolean;
  export?: boolean;
  filter?: boolean;
  authozation?: boolean;
};

const PAGE_META: Record<string, PageMeta> = {
  "/": { title: "Tổng quan" },
  "/products/costs": { title: "Quản lý giá vốn", create: true },
  "/products/thanh-phan": { title: "Quản lý thành phần", create: true },
  "/products/packages": { title: "Quản lý bao bì", create: true },
  "/products/capital": { title: "Quản lý sản phẩm", create: true },
  "/orders": { title: "Quản lý đơn hàng", create: true },
  "/agents": { title: "Quản lý đại lý", create: true },
  "/promotions": { title: "Khuyến mãi", create: true },
  "/staff": { title: "Nhân viên", create: true },
  "/departments": { title: "Phòng ban", create: true },
  "/permission-groups": { title: "Nhóm quyền", create: true },
  "/authozation": { title: "Phân quyền" },
};

export function pageMeta(pathname: string): PageMeta {
  return PAGE_META[pathname] ?? { title: "USA FARM AGRI" };
}

export function pageIdFromPath(pathname: string): string {
  if (pathname === "/") return "home";

  for (const item of NAV_ITEMS) {
    if (item.href === pathname) return item.id;
    const child = item.children?.find((entry) => entry.href === pathname);
    if (child) return child.id;
  }

  return "";
}

export const MOCK_USER = {
  id: "1",
  full_name: "Trần Mạnh Hùng",
  username: "hung",
  email: "hung@usafarm-agri.com",
  role: "1001",
};
