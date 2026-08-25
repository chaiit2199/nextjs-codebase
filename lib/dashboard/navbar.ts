import type { Metadata } from "next";

export type HeaderButtons = {
  create?: boolean;
  export?: boolean;
  filter?: boolean;
  authorization?: boolean;
  search?: boolean;
};

export type NavBarItem = {
  id: string;
  label: string;
  href: string;
  icon: string;
  title?: string;
  resource?: string;
} & HeaderButtons;

export type Navbar = {
  id: string;
  label: string;
  href?: string;
  icon: string;
  title?: string;
  children?: NavBarItem[];
  resource?: string;
} & HeaderButtons;

export const MENU: Navbar[] = [
  { id: "home", label: "Dashboard", href: "/", icon: "hero-squares-2x2", title: "Tổng quan" },
  {
    id: "products",
    label: "Sản phẩm",
    icon: "hero-cube",
    children: [
      {
        id: "cost-management",
        resource: "",
        label: "Quản lý giá vốn",
        href: "/products/cost-management",
        icon: "hero-currency-dollar",
        title: "Quản lý giá vốn",
        create: true,
      },
      {
        id: "ingredients",
        resource: "",
        label: "Quản lý thành phần",
        href: "/products/ingredients",
        icon: "hero-beaker",
        title: "Quản lý thành phần",
        create: true,
      },
      {
        id: "packaging",
        resource: "packing",
        label: "Quản lý bao bì",
        href: "/products/packaging",
        icon: "hero-archive-box",
        title: "Quản lý bao bì",
        create: true,
      },
      {
        id: "product", 
        resource: "product",
        label: "Quản lý thành phẩm",
        href: "/products/product",
        icon: "hero-calculator",
        title: "Quản lý thành phẩm",
        create: true,
      },
    ],
  },
  {
    id: "orders",
    resource: "order",
    label: "Quản lý đơn hàng",
    href: "/orders",
    icon: "hero-clipboard-document-list",
    title: "Quản lý đơn hàng",
    create: true,
  },
  {
    id: "agents",
    resource: "agency",
    label: "Quản lý đại lý",
    href: "/agents",
    icon: "hero-users",
    title: "Quản lý đại lý",
    create: true,
  },
  {
    id: "promotions",
    resource: "promotion",
    label: "Khuyến mãi",
    href: "/promotions",
    icon: "hero-ticket",
    title: "Khuyến mãi",
    create: true,
  },
  {
    id: "management",
    label: "Quản lý",
    icon: "hero-building-office-2",
    children: [
      {
        id: "users",
        resource: "user",
        label: "Nhân viên",
        href: "/users",
        icon: "hero-identification",
        title: "Nhân viên",
        create: true,
        search: true,
      },
      {
        id: "departments",
        resource: "department",
        label: "Phòng ban",
        href: "/departments",
        icon: "hero-user-group",
        title: "Phòng ban",
        create: true,
      },
      {
        id: "permission-groups",
        resource: "",
        label: "Nhóm quyền",
        href: "/permission-groups",
        icon: "hero-shield-check",
        title: "Nhóm quyền",
        create: true,
      },
      {
        id: "authorization",
        resource: "",
        label: "Phân quyền",
        href: "/authorization",
        icon: "hero-cog-6-tooth",
        title: "Phân quyền",
        authorization: true,
      },
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

export const DEFAULT_PAGE_TITLE = "USA FARM AGRI";

export function getPageTitle(pathname: string): string {
  return findMenuItem(pathname)?.title ?? DEFAULT_PAGE_TITLE;
}

export type HeaderConfig = { title: string } & Required<HeaderButtons>;

export function getHeaderConfig(pathname: string): HeaderConfig {
  const item = findMenuItem(pathname);
  return {
    title: getPageTitle(pathname),
    create: Boolean(item?.create),
    export: Boolean(item?.export),
    filter: Boolean(item?.filter),
    authorization: Boolean(item?.authorization),
    search: Boolean(item?.search),
  };
}

export function getPageId(pathname: string) {
  return findMenuItem(pathname)?.id ?? "";
}

export function pageMetadata(pathname: string): Metadata {
  return { title: getPageTitle(pathname) };
}