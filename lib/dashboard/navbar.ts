export type HeaderButtons = {
  create?: boolean;
  export?: boolean;
  filter?: boolean;
  authozation?: boolean;
  search?: boolean;
};

export type NavBarItem = {
  id: string;
  label: string;
  href: string;
  icon: string;
  title?: string;
} & HeaderButtons;

export type Navbar = {
  id: string;
  label: string;
  href?: string;
  icon: string;
  title?: string;
  children?: NavBarItem[];
} & HeaderButtons;

export const MENU: Navbar[] = [
  { id: "home", label: "Dashboard", href: "/", icon: "hero-squares-2x2", title: "Tổng quan" },
  {
    id: "products",
    label: "Sản phẩm",
    icon: "hero-cube",
    children: [
      { id: "costs", label: "Quản lý giá vốn", href: "/products/cost-management", icon: "hero-currency-dollar", create: true },
      { id: "ingredients", label: "Quản lý thành phần", href: "/products/ingredients", icon: "hero-beaker", create: true },
      { id: "packages", label: "Quản lý bao bì", href: "/products/packaging", icon: "hero-archive-box", create: true },
      { id: "finished-goods", label: "Quản lý thành phẩm", href: "/products/finished-goods", icon: "hero-calculator", create: true },
    ]
  },
  { id: "orders", label: "Quản lý đơn hàng", href: "/orders", icon: "hero-clipboard-document-list", create: true },
  { id: "agents", label: "Quản lý đại lý", href: "/agents", icon: "hero-users", create: true },
  { id: "promotions", label: "Khuyến mãi", href: "/promotions", icon: "hero-ticket", create: true },
  {
    id: "management",
    label: "Quản lý",
    icon: "hero-building-office-2",
    children: [
      { id: "staff", label: "Nhân viên", href: "/staff", icon: "hero-identification", create: true, search: true },
      { id: "departments", label: "Phòng ban", href: "/departments", icon: "hero-user-group", create: true },
      { id: "permission_groups", label: "Nhóm quyền", href: "/permission-groups", icon: "hero-shield-check", create: true },
      { id: "authozation", label: "Phân quyền", href: "/authozation", icon: "hero-cog-6-tooth" },
    ],
  },
];

function findMenuItem(pathname: string) {
  for (const item of MENU) {
    if (item.href === pathname) return item;
    const child = item.children?.find((entry) => entry.href === pathname);
    if (child) return child;
  }
  return null;
}

export type HeaderConfig = { title: string } & Required<HeaderButtons>;

export function getHeaderConfig(pathname: string): HeaderConfig {
  const item = findMenuItem(pathname);
  return {
    title: item?.title ?? "USA FARM AGRI",
    create: Boolean(item?.create),
    export: Boolean(item?.export),
    filter: Boolean(item?.filter),
    authozation: Boolean(item?.authozation),
    search: Boolean(item?.search),
  };
}

export function getPageId(pathname: string) {
  return findMenuItem(pathname)?.id ?? "";
}